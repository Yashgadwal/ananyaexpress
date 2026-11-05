'use client';

import { useState } from 'react';
import { Compass, CheckCircle2, EyeOff, Trash2, Edit } from 'lucide-react';

interface TourPackage {
  id: string;
  name: string;
  duration: string;
  startingPrice: number;
  isFeatured: boolean;
  isPublished: boolean;
}

interface PackagesManagerProps {
  initialPackages: TourPackage[];
}

export default function PackagesManager({ initialPackages }: PackagesManagerProps) {
  const [packages, setPackages] = useState<TourPackage[]>(initialPackages);
  const [editingPriceId, setEditingPriceId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentPublished }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(item => item.id === id ? { ...item, isPublished: !currentPublished } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(item => item.id === id ? { ...item, isFeatured: !currentFeatured } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePrice = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startingPrice: parseFloat(newPrice) }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(item => item.id === id ? { ...item, startingPrice: parseFloat(newPrice) } : item));
        setEditingPriceId('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour package?')) return;

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPackages(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {packages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary font-display mb-1">No Packages Found</h3>
          <p className="text-gray-500 text-sm">Please seed the database or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary font-display text-sm">{pkg.name}</span>
                  <span className="text-[10px] bg-slate-100 text-gray-500 py-0.5 px-2 rounded font-bold uppercase">{pkg.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-400 font-semibold">Starting Price:</span>
                  {editingPriceId === pkg.id ? (
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-20 bg-slate-50 border border-gray-250 rounded px-1.5 py-0.5 text-xs text-charcoal"
                      />
                      <button
                        onClick={() => handleSavePrice(pkg.id)}
                        className="bg-primary text-white font-bold py-0.5 px-2 rounded text-[10px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPriceId('')}
                        className="text-gray-400 hover:text-charcoal text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-secondary">Rs {pkg.startingPrice}</span>
                      <button
                        onClick={() => {
                          setEditingPriceId(pkg.id);
                          setNewPrice(pkg.startingPrice.toString());
                        }}
                        className="text-slate-400 hover:text-primary p-0.5"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Moderation actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <button
                  onClick={() => handleTogglePublish(pkg.id, pkg.isPublished)}
                  className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    pkg.isPublished
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-slate-50 text-charcoal border-gray-250 hover:bg-gray-100'
                  }`}
                >
                  {pkg.isPublished ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleToggleFeatured(pkg.id, pkg.isFeatured)}
                  className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center space-x-1 ${
                    pkg.isFeatured
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-50 text-charcoal border-gray-250 hover:bg-gray-100'
                  }`}
                >
                  {pkg.isFeatured ? '★ Featured on Site' : '☆ Feature'}
                </button>

                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded-lg transition-colors cursor-pointer"
                  title="Delete package"
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
