import { PromotionCard as PromotionCardType } from "@/lib/types";
import { fixImageUrl } from "@/lib/utils";
import Image from "next/image";

interface PromotionCardProps {
  promotion: PromotionCardType;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const { promotion_card } = promotion;
  
  return (
    <article className="group relative flex-shrink-0 w-[300px] h-[130px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
      {promotion_card.image?.url ? (
        <>
          <Image
            src={fixImageUrl(`${promotion_card.image.url}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`)}
            alt={promotion_card.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 300px"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
              {promotion_card.title}
            </h3>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white text-xl font-bold">{promotion_card.title}</span>
        </div>
      )}
    </article>
  );
}
