import { getWebsiteSettings } from '@/lib/settings';
import { getTourPackages } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import Link from 'next/link';
import { Compass, Calendar, ArrowRight, MessageCircle } from 'lucide-react';

export const revalidate = 0;

export default async function PackagesPage() {
  const settings = await getWebsiteSettings();
  const packages = await getTourPackages();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-12 px-4 text-center border-b-4 border-secondary">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-display">Ujjain & Madhya Pradesh Tour Packages</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Book professional tour packages for Mahakaleshwar temple, Omkareshwar Jyotirlinga, Maheshwar Fort, and Indore.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {packages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-primary font-display mb-1">No Tour Packages Found</h3>
            <p className="text-gray-500 text-sm">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const places = JSON.parse(pkg.placesCoveredJson) as string[];
              const inclusions = JSON.parse(pkg.inclusionsJson) as string[];
              const waMsg = `Hello Ananya Express, I am interested in booking the ${pkg.name} tour package. Please share details and availability.`;
              const waUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;
              
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header image / graphic */}
                    <div className="h-44 relative overflow-hidden bg-primary">
                      {pkg.featuredImage ? (
                        <img src={pkg.featuredImage} alt={pkg.name} className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 text-white">
                          <Compass className="h-10 w-10 text-accent mb-2" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full z-10">
                        {pkg.duration}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
                        <h3 className="text-sm sm:text-base font-bold font-display text-white line-clamp-1">{pkg.name}</h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Places Covered */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Places Covered:</span>
                        <div className="flex flex-wrap gap-1">
                          {places.map((place, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-slate-100 text-charcoal py-0.5 px-2 rounded-md font-medium border border-gray-200"
                            >
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inclusions */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Inclusions:</span>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {inclusions.slice(0, 3).map((inc, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1 h-1 rounded-full bg-green-500 mr-2"></span>
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-50 bg-slate-50/50 space-y-4">
                    <div className="flex justify-between items-center pt-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Starts at</span>
                        <span className="text-xl font-extrabold text-secondary font-display">Rs {pkg.startingPrice}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">{pkg.duration} Tour</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-3 rounded-lg text-xs shadow-sm text-center transition-colors"
                      >
                        View Itinerary
                      </Link>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-3 rounded-lg text-xs shadow-sm text-center transition-colors flex items-center justify-center space-x-1"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
