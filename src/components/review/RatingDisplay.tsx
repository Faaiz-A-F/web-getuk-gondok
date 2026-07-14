"use client";

import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function RatingDisplay({
  rating,
  totalReviews = 0,
  size = "sm",
  showCount = true,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: { star: "w-3.5 h-3.5", text: "text-xs" },
    md: { star: "w-4 h-4", text: "text-sm" },
    lg: { star: "w-5 h-5", text: "text-base" },
  };

  const s = sizeClasses[size];
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFull = i <= Math.floor(rounded);
          const isHalf = !isFull && i - 0.5 <= rounded;
          return (
            <Star
              key={i}
              className={`${s.star} transition-colors ${
                isFull
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                  ? "fill-amber-200 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          );
        })}
      </div>
      {showCount && (
        <span className={`${s.text} font-medium text-gray-600`}>
          {rating > 0 ? rounded.toFixed(1) : "Belum ada"}
          {totalReviews > 0 && ` (${totalReviews})`}
        </span>
      )}
    </div>
  );
}
