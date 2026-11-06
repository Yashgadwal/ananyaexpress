import { getWebsiteSettings } from '@/lib/settings';
import { getVehicles } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import FleetList from '@/components/FleetList';

export const revalidate = 0;

export default async function FleetPage() {
  const settings = await getWebsiteSettings();
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />
      
      {/* Hero Banner */}
      <div className="bg-primary text-white py-12 px-4 text-center relative border-b-4 border-secondary">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-display">Our Fleet & Vehicle Categories</h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Choose from our premium selection of clean, air-conditioned Sedans, SUVs, and Tempo Travellers for your travels in Ujjain.
          </p>
        </div>
      </div>

      {/* Interactive Fleet List */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <FleetList initialVehicles={vehicles} settings={settings} />
      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
