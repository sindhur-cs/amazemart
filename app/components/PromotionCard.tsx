import { PromotionCard as PromotionCardType } from "@/lib/types";
import Image from "next/image";

interface PromotionCardProps {
  promotion: PromotionCardType;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const { promotion_card } = promotion;
  
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer h-full flex flex-col">
      <div className="relative w-48 h-48 bg-gray-50 overflow-hidden flex-shrink-0">
        {promotion_card.image?.url ? (
          <Image
            src={promotion_card.image.url}
            alt={promotion_card.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-30">🎯</div>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-1">
          {promotion_card.title}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-3 flex-1">
          {promotion_card.description || "No description available"}
        </p>
      </div>
    </article>
  );
}
