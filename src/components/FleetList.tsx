'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, Users, Info, Calendar } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  passengerCapacity: number;
  luggageCapacity: number;
  hasAc: boolean;
  fuelType: string;
  localFare: number;
  outstationPerKm: number;
  driverAllowance: number;
  minKmRule: number;
  imageJson?: string | null;
}

interface FleetListProps {
  initialVehicles: Vehicle[];
  settings: {
    whatsApp: string;
  };
}

export default function FleetList({ initialVehicles, settings }: FleetListProps) {
  const [filter, setFilter] = useState('All');

  const categories = [
    { label: 'All Vehicles', value: 'All' },
    { label: 'Sedans', value: 'Sedan' },
    { label: 'SUVs', value: 'SUV' },
    { label: 'Premium SUVs', value: 'Premium SUV' },
    { label: 'Tempo Travellers', value: 'Tempo Traveller' },
  ];

  const filteredVehicles = initialVehicles.filter((v) => {
    if (filter === 'All') return true;
    return v.category === filter;
  });

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-gray-200 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
              filter === cat.value
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-primary font-display mb-1">No Vehicles Found</h3>
          <p className="text-gray-500 text-sm">Please check back later or contact us directly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((v) => {
            const waMsg = `Hello Ananya Express, I am interested in booking the ${v.name} (${v.category}) for a trip. Please share availability and quotes.`;
            const waUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;
            
            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Visual Image/Graphic for Vehicles */}
                  <div className="bg-slate-100 h-48 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    {(() => {
                      let vehicleImage = '';
                      try {
                        if (v.imageJson) {
                          const images = JSON.parse(v.imageJson);
                          if (Array.isArray(images) && images.length > 0) {
                            vehicleImage = images[0];
                          }
                        }
                      } catch (e) {}
                      
                      return vehicleImage ? (
                        <img src={vehicleImage} alt={v.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="p-4">
                          <Car className="h-16 w-16 text-primary mb-2" />
                          <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                            {v.category}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary font-display">{v.name}</h3>
                      <p className="text-xs text-gray-400 font-semibold">Premium Commercial Fleet</p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-xs font-medium text-charcoal">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-secondary mr-2 shrink-0" />
                        <span>{v.passengerCapacity} Passengers</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-secondary mr-2 shrink-0" />
                        <span>{v.luggageCapacity} Bags</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-secondary mr-2 shrink-0" />
                        <span>{v.hasAc ? 'AC Enabled' : 'Non-AC'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-secondary mr-2 shrink-0" />
                        <span>{v.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-50 bg-slate-50/50 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center pt-4">
                    <div className="bg-white p-2 rounded border border-gray-150 shadow-sm">
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Local Package</span>
                      <span className="text-sm font-bold text-primary">Rs {v.localFare}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-150 shadow-sm">
                      <span className="text-[10px] text-gray-400 uppercase block font-bold">Outstation</span>
                      <span className="text-sm font-bold text-secondary">Rs {v.outstationPerKm}/km</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] text-gray-500 bg-white/80 p-2.5 rounded border border-gray-100">
                    <div>• Minimum Kilometer charge: {v.minKmRule} km/day</div>
                    <div>• Outstation Driver Allowance: Rs {v.driverAllowance}/day</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/fleet/${v.id}`}
                      className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-3 rounded-lg text-xs shadow-sm text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-3 rounded-lg text-xs shadow-sm text-center transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
