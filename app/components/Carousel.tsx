"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageData as PageType, PageComponent } from "@/lib/types";

interface CarouselProps {
  page: PageType | null;
}

export default function Carousel({ page }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = page?.components && Array.isArray(page.components)
    ? page.components
        .filter((comp: PageComponent) => comp.hero_carousel)
        .map((comp: PageComponent) => ({
          src: comp.hero_carousel!.background_image?.url,
          alt: comp.hero_carousel!.title,
          title: comp.hero_carousel!.title,
          subtitle: comp.hero_carousel!.cta.title,
          ctaHref: comp.hero_carousel!.cta.href
        }))
    : [];

  useEffect(() => {
    if (carouselImages.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  if (!page?.components || !Array.isArray(page.components) || carouselImages.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
