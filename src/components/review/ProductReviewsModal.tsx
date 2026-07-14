"use client";

import { useEffect, useState } from "react";
import { X, Star, ImageIcon, Play, Loader2, MessageSquare } from "lucide-react";
import { RatingDisplay } from "./RatingDisplay";

interface ReviewUser {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  photos: string[];
  videoUrl: string | null;
  createdAt: string;
  user: ReviewUser;
}

interface ProductReviewsModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function ProductReviewsModal({ open, onClose, productId, productName }: ProductReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ total: number; avg: number; distribution: Record<number, number> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  useEffect(() => {
    if (!open || !productId) return;
    setFilterRating("all");
    setLoading(true);
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, avg: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
      })
      .catch((e) => console.error("Error fetching reviews:", e))
      .finally(() => setLoading(false));
  }, [open, productId]);

  if (!open) return null;

  const filtered = filterRating === "all" ? reviews : reviews.filter((r) => r.rating === filterRating);

  const getVideoEmbedUrl = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (u.hostname === "youtu.be") {
        return `https://www.youtube.com/embed${u.pathname}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">Ulasan Pelanggan</h2>
            <p className="text-xs text-amber-50/90 mt-0.5 truncate max-w-md">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats summary */}
        {stats && stats.total > 0 && (
          <div className="px-6 py-5 bg-amber-50 border-b border-amber-100 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-amber-900">{stats.avg.toFixed(1)}</div>
                  <RatingDisplay rating={stats.avg} size="md" showCount={false} />
                  <p className="text-xs text-gray-600 mt-1">{stats.total} ulasan</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star] || 0;
                  const pct = stats.total === 0 ? 0 : (count / stats.total) * 100;
                  return (
                    <button
                      key={star}
                      onClick={() => setFilterRating(filterRating === star ? "all" : star)}
                      className="flex items-center gap-2 w-full text-left hover:bg-white/50 rounded-lg p-1 transition"
                    >
                      <span className="text-xs font-semibold text-gray-700 w-4">{star}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filter chip */}
        {stats && stats.total > 0 && (
          <div className="px-6 py-3 flex items-center gap-2 flex-shrink-0 border-b border-gray-100 overflow-x-auto">
            <button
              onClick={() => setFilterRating("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filterRating === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua ({stats.total})
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? "all" : star)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 ${
                    filterRating === star
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {star} <Star className="w-3 h-3 fill-current" /> ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Reviews list */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Memuat ulasan...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900">Belum ada ulasan</h3>
              <p className="text-sm text-gray-500 mt-1">
                {filterRating === "all"
                  ? "Jadilah yang pertama memberi ulasan untuk produk ini."
                  : `Tidak ada ulasan dengan rating ${filterRating} bintang.`}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((review) => (
                <article
                  key={review.id}
                  className="border border-gray-200 rounded-2xl p-4 bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(review.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {review.user?.name || "Pelanggan"}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="mt-1">
                        <RatingDisplay rating={review.rating} size="sm" showCount={false} />
                      </div>

                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                          {review.comment}
                        </p>
                      )}

                      {review.photos && review.photos.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {review.photos.map((photo, i) => (
                            <a
                              key={i}
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition"
                            >
                              <img
                                src={photo}
                                alt={`Foto ulasan ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      {review.videoUrl && (
                        <div className="mt-3">
                          {(() => {
                            const embed = getVideoEmbedUrl(review.videoUrl);
                            if (!embed) return null;
                            const isEmbed = embed.includes("/embed/");
                            if (isEmbed) {
                              return (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                  <iframe
                                    src={embed}
                                    title="Review video"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              );
                            }
                            return (
                              <a
                                href={review.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium hover:bg-amber-100 transition"
                              >
                                <Play className="w-4 h-4" />
                                Tonton video
                              </a>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
