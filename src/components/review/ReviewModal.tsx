"use client";

import { useState, useRef, useEffect } from "react";
import { X, Star, Upload, Video, Trash2, Loader2, ImageIcon } from "lucide-react";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  orderId: string;
  orderNumber: string;
  onSubmitted?: () => void;
}

const MAX_PHOTOS = 6;
const MAX_VIDEO_URL_LENGTH = 500;
const MAX_COMMENT_LENGTH = 2000;

export function ReviewModal({
  open,
  onClose,
  productId,
  productName,
  productImage,
  userId,
  orderId,
  orderNumber,
  onSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (open) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setPhotos([]);
      setVideoUrl("");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  if (!open) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToProcess = files.slice(0, remainingSlots);

    setUploadingPhoto(true);
    setError("");

    try {
      const newPhotos: string[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) {
          setError("Semua file harus berupa gambar");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Ukuran setiap foto maksimal 5MB");
          continue;
        }
        const base64 = await readFileAsDataURL(file);
        newPhotos.push(base64);
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      console.error("Error reading files:", err);
      setError("Gagal membaca foto");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError("");

    if (rating < 1) {
      setError("Silakan pilih rating 1-5 bintang");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          orderId,
          rating,
          comment: comment.trim() || null,
          photos,
          videoUrl: videoUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim ulasan");
        return;
      }

      setSuccess(true);
      onSubmitted?.();
      // Auto-close after 1.5s on success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Submit review error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">Beri Ulasan</h2>
            <p className="text-xs text-amber-50/90 mt-0.5">Pesanan #{orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Product info */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-amber-200 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-amber-700" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Produk</p>
              <p className="font-bold text-amber-950 truncate">{productName}</p>
            </div>
          </div>

          {/* Rating stars */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Bagaimana pengalaman Anda? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={submitting}
                    className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                    aria-label={`Beri ${star} bintang`}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        isActive
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-700">
                  {ratingLabel(rating)}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Ulasan (opsional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
              placeholder="Ceritakan pengalaman Anda dengan produk ini..."
              rows={4}
              maxLength={MAX_COMMENT_LENGTH}
              disabled={submitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </p>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Foto (opsional, maks. {MAX_PHOTOS})
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    disabled={submitting}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                    aria-label="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting || uploadingPhoto}
                  className="aspect-square rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 flex flex-col items-center justify-center gap-1 text-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Maks 5MB per foto.</p>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Link Video (opsional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) =>
                setVideoUrl(e.target.value.slice(0, MAX_VIDEO_URL_LENGTH))
              }
              placeholder="https://youtube.com/... atau link video lainnya"
              maxLength={MAX_VIDEO_URL_LENGTH}
              disabled={submitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tempelkan URL video YouTube, TikTok, atau platform lainnya.
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
              ✓ Ulasan berhasil dikirim! Terima kasih atas masukan Anda.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || success}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Ulasan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ratingLabel(rating: number): string {
  switch (rating) {
    case 1: return "Sangat Buruk";
    case 2: return "Buruk";
    case 3: return "Cukup";
    case 4: return "Bagus";
    case 5: return "Sangat Bagus";
    default: return "";
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
