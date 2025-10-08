import { PromotionCard as PromotionCardType } from "@/lib/types";
import PromotionCard from "./PromotionCard";

interface PromotionGridProps {
  promotionData: PromotionCardType[] | null;
  title?: string;
}

export default function PromotionGrid({ promotionData, title }: PromotionGridProps) {
  if (!promotionData || promotionData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Promotions Available</h2>
          <p className="text-gray-600">Check back later for new deals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {title || "Spotlight Deals"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-12 items-center justify-center">
        {promotionData.map((promotion) => (
          <PromotionCard key={promotion.promotion_card._metadata.uid} promotion={promotion} />
        ))}
      </div>

      {promotionData.length >= 6 && (
        <div className="text-center mt-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            View More Deals
          </button>
        </div>
      )}
    </div>
  );
}
