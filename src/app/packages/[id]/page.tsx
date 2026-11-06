import { getWebsiteSettings } from '@/lib/settings';
import { getTourPackageById } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import PackageEnquiryForm from '@/components/PackageEnquiryForm';
import { notFound } from 'next/navigation';
import { Compass, CheckCircle2, XCircle, Clock, MapPin, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function PackageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const settings = await getWebsiteSettings();
  
  const pkg = await getTourPackageById(id);

  if (!pkg) {
    notFound();
  }

  // Parse JSON data fields
  const places = JSON.parse(pkg.placesCoveredJson) as string[];
  const inclusions = JSON.parse(pkg.inclusionsJson) as string[];
  const exclusions = JSON.parse(pkg.exclusionsJson) as string[];
  const itinerary = JSON.parse(pkg.itineraryJson) as ItineraryItem[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        
        {/* Back Link */}
        <Link href="/packages" className="inline-flex items-center text-sm font-semibold text-primary hover:text-secondary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Tour Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Itinerary, Inclusions, Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header / Intro Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 relative overflow-hidden">
              <div className="h-56 rounded-xl relative overflow-hidden bg-primary flex flex-col justify-center items-center text-center p-4 mb-6">
                {pkg.featuredImage ? (
                  <img src={pkg.featuredImage} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                  <Compass className="h-16 w-16 text-accent mb-2 z-10" />
                )}
                <h1 className="text-xl sm:text-2xl font-bold font-display px-2 text-white z-10 relative drop-shadow">{pkg.name}</h1>
                <span className="bg-secondary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full mt-3 z-10 relative">
                  {pkg.duration} Pilgrimage Tour
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-secondary" />
                    <span>Duration: {pkg.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-secondary" />
                    <span>Places: {places.length} Destinations</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-primary mr-1">Starting Price:</span>
                    <span className="text-secondary font-bold">Rs {pkg.startingPrice}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase font-bold text-gray-400 mb-2">Places Covered:</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {places.map((place, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-charcoal py-1 px-2.5 rounded-lg font-medium border border-gray-200">
                        📍 {place}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
              <h2 className="text-lg font-bold text-primary font-display mb-6 border-b border-gray-100 pb-2 flex items-center">
                <Compass className="h-5 w-5 text-secondary mr-2" />
                Tour Itinerary Walkthrough
              </h2>

              <div className="relative border-l border-gray-200 ml-4 space-y-8 pb-4">
                {itinerary.map((item, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Bullet marker */}
                    <div className="absolute -left-[9px] top-1.5 bg-secondary text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow-sm">
                      {item.day}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-primary font-display">
                        Day {item.day}: {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
                <h3 className="text-sm font-bold text-primary font-display mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide flex items-center text-green-700">
                  <CheckCircle2 className="h-4.5 w-4.5 text-green-500 mr-2 shrink-0" />
                  What Is Included
                </h3>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  {inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shrink-0 mt-2"></span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
                <h3 className="text-sm font-bold text-primary font-display mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide flex items-center text-red-700">
                  <XCircle className="h-4.5 w-4.5 text-red-500 mr-2 shrink-0" />
                  What Is Excluded
                </h3>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  {exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 shrink-0 mt-2"></span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Info / FAQs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
              <h3 className="text-sm font-bold text-primary font-display mb-3 border-b border-gray-100 pb-2 flex items-center">
                <HelpCircle className="h-4 w-4 text-secondary mr-2 shrink-0" />
                Important Instructions
              </h3>
              <ul className="text-xs text-gray-500 space-y-2 leading-relaxed">
                <li>• Rates shown are starting estimates. Final quote varies based on vehicle type and travel dates.</li>
                <li>• Bhasma Aarti tickets and temple VIP entry slips are NOT included in general rates. Customers must book them in advance.</li>
                <li>• Saffron or traditional dress is mandatory to enter the inner sanctum of Mahakaleshwar temple.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Dynamic Booking Request Form */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-md border border-gray-150 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-primary font-display">Inquire Package</h3>
              <p className="text-xs text-gray-500 mt-1">
                Customize this itinerary or request pricing for this package.
              </p>
            </div>
            
            <PackageEnquiryForm
              packageId={pkg.id}
              packageName={pkg.name}
              packageDuration={pkg.duration}
              settings={settings}
            />

            <div className="border-t border-gray-100 pt-4 text-center">
              <a
                href={`tel:${settings.phone}`}
                className="text-xs font-bold text-secondary hover:underline"
                title="Package Detail Call"
              >
                📞 Prefer to talk? Call: {settings.phone}
              </a>
            </div>
          </div>

        </div>

      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
