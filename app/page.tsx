"use client";

import PromotionGrid from "./components/PromotionGrid";
import { useHeader } from "./components/HeaderProvider";
import Image from "next/image";

export default function Home() {
  const { header, page, loading: headerLoading } = useHeader();

  const promotionData = page?.promotion || null;

  if (headerLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-16 h-16">
              <Image
                src={header?.contentstack_logo?.url ? `${header.contentstack_logo.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}` : "/logo_gif.webp"}
                alt="Loading..."
                width={64}
                height={64}
                className="w-16 h-16 object-contain"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Promotions...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch the latest deals</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      <PromotionGrid
        promotionData={promotionData}
        title="Spotlight Deals"
      />
    </main>
  );
}