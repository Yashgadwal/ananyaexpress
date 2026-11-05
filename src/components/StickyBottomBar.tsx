'use client';

import { Phone, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

interface StickyBottomBarProps {
  settings: {
    phone: string;
    whatsApp: string;
  };
}

export default function StickyBottomBar({ settings }: StickyBottomBarProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20want%20to%20book%20a%20taxi.`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.08)] grid grid-cols-3 md:hidden h-16 safe-bottom">
      {/* Call Now */}
      <a
        href={`tel:${settings.phone}`}
        className="flex flex-col items-center justify-center text-primary-light hover:text-secondary hover:bg-gray-50 border-r border-gray-100 transition-colors"
        title="Mobile Bottom Call"
      >
        <Phone className="h-5 w-5 text-secondary" />
        <span className="text-[10px] font-bold mt-1">Call Now</span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-whatsapp hover:text-whatsapp-dark hover:bg-gray-50 border-r border-gray-100 transition-colors"
      >
        <MessageCircle className="h-5 w-5 fill-whatsapp/10" />
        <span className="text-[10px] font-bold mt-1">WhatsApp</span>
      </a>

      {/* Book Taxi */}
      <Link
        href="/#booking-form"
        className="flex flex-col items-center justify-center bg-secondary hover:bg-secondary-light text-white transition-colors"
      >
        <Calendar className="h-5 w-5 text-accent" />
        <span className="text-[10px] font-bold mt-1">Book Taxi</span>
      </Link>
    </div>
  );
}
