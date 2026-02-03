"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGalleryEntries } from "@/lib/contentstack";
import { GalleryEntry } from "@/lib/types";

export default function NewLaunchesPage() {
  const [launches, setLaunches] = useState<GalleryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLaunches() {
      try {
        const entries = await getGalleryEntries();
        setLaunches(entries);
      } catch (error) {
        console.error("Error fetching launches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLaunches();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading new launches...</p>
          </div>
        </div>
      </main>
    );
  }

  if (launches.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">New Launches</h1>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Launches Available</h2>
            <p className="text-gray-600">Check back later for new product launches!</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Launches</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {launches.map((launch) => {
            // Get the first image as the thumbnail
            const thumbnailImage = launch.gallery?.gallery_images?.[0];
            
            return (
              <Link
                key={launch.uid}
                href={`/new-launches/${launch.uid}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  {thumbnailImage?.url ? (
                    <Image
                      src={`${thumbnailImage.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`}
                      alt={launch.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
                      <span className="text-white text-xl font-bold">{launch.title}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                    {launch.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {launch.description || "Explore this new launch"}
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <span>View Gallery</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
