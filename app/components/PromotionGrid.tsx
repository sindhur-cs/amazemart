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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-4 items-stretch justify-center overflow-x-auto pb-2">
        {promotionData.map((promotion) => (
          <PromotionCard key={promotion.promotion_card._metadata.uid} promotion={promotion} />
        ))}
      </div>

      {promotionData.length >= 6 && (
        <div className="text-center mt-10">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg">
            View More Deals
          </button>
        </div>
      )}
    </div>
  );
}
