import { getWebsiteSettings } from '@/lib/settings';
import { getVehicleById, getVehicles } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import BookingForm from '@/components/BookingForm';
import { notFound } from 'next/navigation';
import { Car, ShieldCheck, Check, Info, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function VehicleDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const settings = await getWebsiteSettings();
  
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  // Fetch all vehicles for the booking form drop-down
  const allVehicles = await getVehicles();

  const waMsg = `Hello Ananya Express, I want to book the ${vehicle.name} (${vehicle.category}). Please share availability and rates.`;
  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        
        {/* Back Link */}
        <Link href="/fleet" className="inline-flex items-center text-sm font-semibold text-primary hover:text-secondary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Our Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 relative">
              <div className="bg-slate-100 h-64 rounded-xl flex flex-col justify-center items-center text-center relative overflow-hidden mb-6">
                {(() => {
                  let vehicleImage = '';
                  try {
                    if (vehicle.imageJson) {
                      const images = JSON.parse(vehicle.imageJson);
                      if (Array.isArray(images) && images.length > 0) {
                        vehicleImage = images[0];
                      }
                    }
                  } catch (e) {}
                  
                  return vehicleImage ? (
                    <img src={vehicleImage} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-4">
                      <Car className="h-24 w-24 text-primary" />
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider mt-2 block">
                        {vehicle.category}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-2">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {vehicle.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-display">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  Reg Code / Internal Preference: {vehicle.regNumber || 'Verified Category'}
                </p>
              </div>
            </div>

            {/* Pricing details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
              <h2 className="text-lg font-bold text-primary font-display mb-4 border-b border-gray-100 pb-2">
                Fare Breakdown & Pricing Rules
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Ujjain Local package</span>
                  <span className="text-2xl font-extrabold text-primary block mt-1 font-display">Rs {vehicle.localFare}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Includes 8 Hours / 80 Kilometers</span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-500 uppercase font-bold block">Outstation rate</span>
                  <span className="text-2xl font-extrabold text-secondary block mt-1 font-display">Rs {vehicle.outstationPerKm}/km</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Charged based on actual round-trip KMs</span>
                </div>
              </div>

              <div className="mt-6 space-y-3.5 text-sm text-charcoal pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Minimum Charge Rule:</span>
                  <span className="font-semibold">{vehicle.minKmRule} KMs / Day (for Outstation)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Driver Allowance:</span>
                  <span className="font-semibold">Rs {vehicle.driverAllowance} / Day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Night Charge (After 10 PM):</span>
                  <span className="font-semibold">Rs 250 / Night</span>
                </div>
              </div>
            </div>

            {/* Specifications sheet */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
              <h2 className="text-lg font-bold text-primary font-display mb-4 border-b border-gray-100 pb-2">
                Vehicle Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Seats</span>
                  <span className="text-base font-bold text-primary">{vehicle.passengerCapacity} Seater</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Luggage</span>
                  <span className="text-base font-bold text-primary">{vehicle.luggageCapacity} Bags</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Air Condition</span>
                  <span className="text-base font-bold text-primary">{vehicle.hasAc ? 'Yes (AC)' : 'No AC'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Fuel Type</span>
                  <span className="text-base font-bold text-primary">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150">
              <h2 className="text-lg font-bold text-primary font-display mb-3 border-b border-gray-100 pb-2">
                Terms & Disclaimers
              </h2>
              <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>The vehicle model displayed is representative; if unavailable, a similar category Sedan or SUV will be provided.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>State taxes, tolls, parking tickets, and terminal entries are extra and are payable by the customer directly.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>One-way bookings may include round-trip toll calculations depending on the state border regulations.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Direct Booking Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-md border border-gray-150 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-primary font-display">Book This Vehicle</h3>
              <p className="text-xs text-gray-500 mt-1">
                Submit this form to book the <strong>{vehicle.name}</strong> or get a quick quotation.
              </p>
            </div>
            
            <BookingForm 
              vehicles={allVehicles} 
              settings={settings}
            />

            <div className="border-t border-gray-100 pt-4 flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <span>Inquire on WhatsApp</span>
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 border border-gray-250 transition-colors"
                title="Vehicle Detail Call"
              >
                <span>Call Now</span>
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
