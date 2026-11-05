'use client';

import { useState } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, ShieldAlert } from 'lucide-react';
import RatingStars from '@/components/RatingStars';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  travelType: string;
  dateText: string;
  isFeatured: boolean;
  isApproved: boolean;
}

interface ReviewsManagerProps {
  initialReviews: Review[];
}

export default function ReviewsManager({ initialReviews }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleToggleApprove = async (id: string, currentApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentApproved }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(item => item.id === id ? { ...item, isApproved: !currentApproved } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(item => item.id === id ? { ...item, isFeatured: !currentFeatured } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary font-display mb-1">No Reviews Found</h3>
          <p className="text-gray-500 text-sm">Customers have not submitted reviews online yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-primary font-display text-sm">{r.customerName}</span>
                  <RatingStars rating={r.rating} />
                  <span className="text-[10px] bg-slate-100 text-gray-400 py-0.5 px-2 rounded font-bold uppercase">{r.travelType}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 italic">
                  "{r.reviewText}"
                </p>
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Submitted: {r.dateText}</div>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <button
                  onClick={() => handleToggleApprove(r.id, r.isApproved)}
                  className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    r.isApproved
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-slate-50 text-charcoal border-gray-250 hover:bg-gray-100'
                  }`}
                >
                  {r.isApproved ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      <span>Approved</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>Approve</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggleFeatured(r.id, r.isFeatured)}
                  className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    r.isFeatured
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-50 text-charcoal border-gray-250 hover:bg-gray-100'
                  }`}
                >
                  {r.isFeatured ? '★ Featured on Site' : '☆ Feature'}
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
