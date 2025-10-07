import { PromotionList } from "@/lib/types";
import PromotionCard from "./PromotionCard";

interface PromotionGridProps {
  promotionData: PromotionList | null;
  title?: string;
}

export default function PromotionGrid({ promotionData, title }: PromotionGridProps) {
  if (!promotionData?.promotion_list?.cards || promotionData.promotion_list.cards.length === 0) {
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

  const { promotion_list } = promotionData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {title || promotion_list.title}
        </h2>
        {promotion_list.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">
            {promotion_list.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
        {promotion_list.cards.map((promotion) => (
          <PromotionCard key={promotion.card._metadata.uid} promotion={promotion} />
        ))}
      </div>

      {promotion_list.cards.length >= 6 && (
        <div className="text-center mt-12">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            View More Deals
          </button>
        </div>
      )}
    </div>
  );
}
