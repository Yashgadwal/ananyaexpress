'use client';

import { useState } from 'react';
import { Image, CheckCircle, EyeOff, Trash2 } from 'lucide-react';

interface PromoBanner {
  id: string;
  heading: string;
  description: string;
  isActive: boolean;
}

interface BannersManagerProps {
  initialBanners: PromoBanner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<PromoBanner[]>(initialBanners);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (response.ok) {
        setBanners(prev => prev.map(item => item.id === id ? { ...item, isActive: !currentActive } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBanners(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {banners.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary font-display mb-1">No Active Promo Banners</h3>
          <p className="text-gray-500 text-sm">Add offers like "Mahakal Lok Special Offer" or "Monsoon Deals".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-primary font-display">{b.heading}</h4>
                <p className="text-xs text-gray-500 font-light">{b.description}</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <button
                  onClick={() => handleToggleActive(b.id, b.isActive)}
                  className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    b.isActive
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-slate-50 text-charcoal border-gray-250 hover:bg-gray-100'
                  }`}
                >
                  {b.isActive ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Delete banner"
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
