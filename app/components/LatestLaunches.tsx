"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getGalleryEntries } from "@/lib/contentstack";
import { fixImageUrl } from "@/lib/utils";
import { useHeader } from "./HeaderProvider";

interface GalleryImage {
  uid: string;
  url: string;
  title: string;
  description?: string;
}

interface GalleryEntry {
  uid: string;
  title: string;
  gallery?: {
    gallery_images: GalleryImage[];
  };
}

export default function LatestLaunches() {
  const [launches, setLaunches] = useState<GalleryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useHeader();

  useEffect(() => {
    async function fetchLaunches() {
      try {
        const entries = await getGalleryEntries(locale);
        setLaunches(entries.slice(0, 4));
      } catch (error) {
        console.error("Error fetching launches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLaunches();
  }, [locale]);

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (launches.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Launches</h2>
          <Link 
            href="/new-launches" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Launches Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {launches.map((launch) => {
            const thumbnailImage = launch.gallery?.gallery_images?.[0];
            return (
              <Link
                key={launch.uid}
                href={`/new-launches/${launch.uid}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100"
              >
                {thumbnailImage?.url ? (
                  <Image
                    src={fixImageUrl(`${thumbnailImage.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`)}
                    alt={launch.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
                    <span className="text-white text-4xl">🚀</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">
                    {launch.title}
                  </h3>
                  <span className="text-white/80 text-xs mt-1 flex items-center">
                    Explore
                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* New Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    NEW
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
