"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
  product: { id: string; name: string };
}

interface ReviewCarouselProps {
  reviews?: Review[];
  autoPlayInterval?: number;
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1500;

export function ReviewCarousel({ reviews: propReviews, autoPlayInterval = 5000 }: ReviewCarouselProps) {
  const [reviews, setReviews] = useState<Review[]>(propReviews || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(!propReviews);
  const [fetchError, setFetchError] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  // Fetch reviews from API if not provided as prop, with retry logic
  const fetchReviews = useCallback(async () => {
    if (propReviews) return;

    try {
      setFetchError(false);
      const response = await fetch('/api/reviews/landing');

      // Always read the body — only parse JSON for successful responses
      if (!response.ok) {
        // Try to parse error body (might be JSON or plain text)
        try {
          const errorData = await response.json();
          console.warn('Landing reviews API error:', errorData);
        } catch {
          // Body might be empty or not JSON; ignore
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!mountedRef.current) return;

      if (data.reviews) {
        setReviews(data.reviews);
      }
      retryCountRef.current = 0; // reset on success
    } catch (error) {
      if (!mountedRef.current) return;

      // Retry up to MAX_RETRIES times with a delay
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        console.warn(
          `Failed to fetch landing reviews (attempt ${retryCountRef.current}/${MAX_RETRIES + 1}), retrying...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchReviews();
      }

      console.error('Failed to fetch landing reviews after retries:', error);
      setFetchError(true);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [propReviews]);

  useEffect(() => {
    mountedRef.current = true;
    retryCountRef.current = 0;

    if (propReviews) {
      setReviews(propReviews);
      setLoading(false);
      return;
    }

    fetchReviews();

    return () => {
      mountedRef.current = false;
    };
  }, [propReviews, fetchReviews]);

  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, reviews.length, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm animate-pulse">
          <div className="h-5 w-32 bg-white/20 rounded mb-4" />
          <div className="h-6 w-full bg-white/20 rounded mb-3" />
          <div className="h-6 w-3/4 bg-white/20 rounded mb-6" />
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-28 bg-white/20 rounded mb-1" />
              <div className="h-3 w-20 bg-white/20 rounded" />
            </div>
            <div className="h-3 w-24 bg-white/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Show error fallback
  if (fetchError) {
    return (
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm text-center">
          <p className="text-amber-200/70 text-sm">
            Testimoni belum tersedia. Silakan kembali lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Review Card */}
      <div 
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 text-left backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Decorative quote icon */}
        <div className="absolute top-4 right-4 text-6xl text-white/10 font-serif leading-none">
          "
        </div>

        {/* Rating Stars */}
        <div className="mb-4">
          {renderStars(currentReview.rating)}
        </div>

        {/* Review Text */}
        <blockquote className="relative">
          <p className="text-lg leading-7 text-amber-50">
            "{currentReview.comment || "Tanpa komentar"}"
          </p>
        </blockquote>

        {/* Reviewer Info */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">{currentReview.user.name}</div>
            <div className="text-sm text-amber-200">{currentReview.product.name}</div>
          </div>
          <div className="text-xs text-amber-300/70">
            {new Date(currentReview.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 review */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-amber-900 shadow-xl transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-2xl"
            aria-label="Previous review"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-amber-900 shadow-xl transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-2xl"
            aria-label="Next review"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if more than 1 review */}
      {reviews.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
