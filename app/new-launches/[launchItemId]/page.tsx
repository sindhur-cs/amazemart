"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGalleryEntryByUid } from "@/lib/contentstack";
import { GalleryEntry, VisualMarkup } from "@/lib/types";
import { useHeader } from "../../components/HeaderProvider";

interface ActiveHotspot {
  imageIndex: number;
  hotspot: VisualMarkup;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export default function LaunchItemDetailPage() {
  const params = useParams();
  const launchItemId = params.launchItemId as string;
  const { locale } = useHeader();
  
  const [launch, setLaunch] = useState<GalleryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<ActiveHotspot | null>(null);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{[key: number]: ImageDimensions}>({});
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleHotspots = () => {
    setHotspotsVisible(!hotspotsVisible);
    setSelectedHotspot(null);
  };

  useEffect(() => {
    async function fetchLaunchDetails() {
      try {
        setLoading(true);
        const entry = await getGalleryEntryByUid(launchItemId, locale);
        setLaunch(entry);
      } catch (error) {
        console.error("Error fetching launch details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (launchItemId) {
      fetchLaunchDetails();
    }
  }, [launchItemId, locale]);

  // Handle image load to get natural dimensions
  const handleImageLoad = (index: number, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageDimensions(prev => ({
      ...prev,
      [index]: {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    }));
  };

  // Convert pixel coordinates to percentages based on actual image dimensions
  // For BoundingBox type, calculate the center position
  const convertCoordinatesToPercentage = (hotspot: VisualMarkup, imageIndex: number) => {
    const imgDims = imageDimensions[imageIndex];
    if (!imgDims) {
      // Return original if dimensions not loaded yet
      return { x: 0, y: 0 };
    }
    
    const { coordinates, type } = hotspot;
    
    // For BoundingBox, calculate center position
    if (type === 'BoundingBox' && coordinates.width && coordinates.height) {
      const centerX = coordinates.x + (coordinates.width / 2);
      const centerY = coordinates.y + (coordinates.height / 2);
      return {
        x: (centerX / imgDims.width) * 100,
        y: (centerY / imgDims.height) * 100
      };
    }
    
    // For Hotspot type, use x, y directly
    return {
      x: (coordinates.x / imgDims.width) * 100,
      y: (coordinates.y / imgDims.height) * 100
    };
  };

  const handleHotspotClick = (hotspot: VisualMarkup, imageIndex: number) => {
    if (selectedHotspot?.hotspot.id === hotspot.id && selectedHotspot?.imageIndex === imageIndex) {
      // Close if clicking the same hotspot
      setSelectedHotspot(null);
      setPlayingVideo(false);
    } else {
      setSelectedHotspot({ hotspot, imageIndex });
      setPlayingVideo(false);
    }
  };

  const closeHotspot = () => {
    setSelectedHotspot(null);
    setPlayingVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handlePlayVideo = () => {
    setPlayingVideo(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </main>
    );
  }

  if (!launch) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Launch Not Found</h2>
            <p className="text-gray-600 mb-6">The launch you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/new-launches"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Launches
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const galleryImages = launch.gallery?.gallery_images || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Toggle Button for Hotspots */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{launch.title}</h1>
          <button
            onClick={toggleHotspots}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
              hotspotsVisible
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {hotspotsVisible ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              )}
            </svg>
            <span>{hotspotsVisible ? 'Hide Hotspots' : 'Show Hotspots'}</span>
          </button>
        </div>
      </div>

      {/* Full Width Stacked Images with Hotspots */}
      <div className="w-full">
        {galleryImages.map((image, index) => {
          // Get visual_markups directly from the image
          const imageMarkups = Array.isArray(image.visual_markups) ? image.visual_markups : [];
          const hasDimensions = !!imageDimensions[index];
          
          return (
            <div
              key={image.uid}
              className="w-full relative"
            >
              <div className="relative w-full">
                {/* Use regular img tag to get natural dimensions */}
                <img
                  src={`${image.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`}
                  alt={image.title || `${launch.title} - Image ${index + 1}`}
                  className="w-full h-auto"
                  loading={index === 0 ? "eager" : "lazy"}
                  onLoad={(e) => handleImageLoad(index, e)}
                />
                
                {/* Hotspots - Only render when image dimensions are loaded */}
                {hotspotsVisible && hasDimensions && imageMarkups.length > 0 && (
                  <div className="absolute inset-0">
                    {imageMarkups.map((hotspot, markupIndex) => {
                      const coords = convertCoordinatesToPercentage(hotspot, index);
                      const isSelected = selectedHotspot?.hotspot.id === hotspot.id && selectedHotspot?.imageIndex === index;
                      
                      return (
                        <div
                          key={hotspot.id || markupIndex}
                          className="absolute z-10"
                          style={{
                            left: `${coords.x}%`,
                            top: `${coords.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {/* Hotspot Marker */}
                          <button
                            onClick={() => handleHotspotClick(hotspot, index)}
                            className={`relative w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-500 scale-125' 
                                : 'bg-blue-400 hover:bg-blue-500 hover:scale-110'
                            }`}
                            aria-label={`View details: ${hotspot.title}`}
                          >
                            {/* Pulsing animation ring */}
                            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
                            {/* Inner dot */}
                            <span className="absolute inset-1 rounded-full bg-white"></span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected Hotspot Info Popup */}
                {hotspotsVisible && selectedHotspot && selectedHotspot.imageIndex === index && hasDimensions && (
                  <div 
                    className="absolute z-50 w-80 bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl overflow-hidden"
                    style={{
                      left: `${convertCoordinatesToPercentage(selectedHotspot.hotspot, index).x}%`,
                      top: `${convertCoordinatesToPercentage(selectedHotspot.hotspot, index).y}%`,
                      transform: 'translate(10px, -50%)',
                    }}
                  >
                    {/* Close button */}
                    <button
                      onClick={closeHotspot}
                      className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="p-4">
                      <h3 className="text-blue-400 font-semibold text-sm mb-2 pr-6">
                        {selectedHotspot.hotspot.title}
                      </h3>
                      <p className="text-gray-300 text-xs leading-relaxed mb-3">
                        {selectedHotspot.hotspot.description}
                      </p>

                      {/* Video Player */}
                      {selectedHotspot.hotspot.url && (
                        <div className="mt-3">
                          {playingVideo ? (
                            <div className="relative rounded-lg overflow-hidden bg-black">
                              <video
                                ref={videoRef}
                                src={selectedHotspot.hotspot.url}
                                controls
                                autoPlay
                                className="w-full h-auto max-h-40"
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <button
                              onClick={handlePlayVideo}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium cursor-pointer w-full justify-center"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              <span>Play Video</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
