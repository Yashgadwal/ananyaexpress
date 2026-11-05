import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export default function RatingStars({ rating, maxStars = 5, className = 'h-4 w-4' }: RatingStarsProps) {
  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        return (
          <Star
            key={index}
            className={`${className} ${
              isFilled ? 'text-accent fill-accent' : 'text-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
}
