import { getWebsiteSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import { Shield, FileText, Info } from 'lucide-react';

export const revalidate = 0;

export default async function PoliciesPage() {
  const settings = await getWebsiteSettings();

  const policySections = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      content: settings.privacyPolicy || 'We respect your privacy. Personal information supplied is solely used to organize your taxi bookings.',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      content: settings.termsConditions || 'Rates discussed are subject to change based on actual run details. Parking, tolls, and state entry fees are extra.',
    },
    {
      id: 'booking',
      title: 'Booking Policy',
      content: settings.bookingPolicy || 'Advance payment is required to confirm bookings, especially for outstation trips and Tempo Travellers.',
    },
    {
      id: 'cancellation',
      title: 'Cancellation Policy',
      content: settings.cancellationPolicy || 'Cancellations made 24 hours prior to travel time receive a full refund.',
    },
    {
      id: 'refund',
      title: 'Refund Policy',
      content: settings.refundPolicy || 'Eligible refunds are processed back to the original payment source within 5 to 7 business days.',
    },
    {
      id: 'disclaimer',
      title: 'Driver & Vehicle Disclaimer',
      content: settings.driverDisclaimer || 'Vehicle models shown are subject to availability. An equivalent category vehicle will be provided if unavailable.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar settings={settings} />

      <div className="bg-primary text-white py-12 px-4 text-center border-b-4 border-secondary">
        <div className="relative max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-display">Terms, Conditions & General Policies</h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto font-light">
            Please read our cancellation rules, refunds, booking protocols, and disclaimers before confirming your booking.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-8">
        {policySections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-150 scroll-mt-24"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 mb-4">
              <FileText className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-bold text-primary font-display">{section.title}</h2>
            </div>
            <p className="text-charcoal text-sm leading-relaxed whitespace-pre-line font-light">
              {section.content}
            </p>
          </section>
        ))}
      </main>

      <Footer settings={settings} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
