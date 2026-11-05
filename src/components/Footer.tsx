import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

interface FooterProps {
  settings: {
    businessName: string;
    phone: string;
    whatsApp: string;
    email: string;
    addressFreeganj: string;
    addressNanakheda: string;
    businessHours: string;
    socialFacebook?: string | null;
    socialInstagram?: string | null;
    socialTwitter?: string | null;
    justdialLink?: string | null;
  };
}

export default function Footer({ settings }: FooterProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20want%20to%20enquire%20about%20a%20taxi.`;

  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-24 md:pb-12 border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <img src="/images/logo.png" alt="Ananya Express" className="h-11 w-11 object-contain rounded-lg bg-white p-0.5 shadow-sm border border-gray-100" />
              <div>
                <span className="text-base font-bold tracking-tight text-white font-display block leading-none">Ananya</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary block mt-0.5">
                  Express
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Trusted taxi service and car rental provider based in Ujjain. Offering professional drivers and neat vehicles for local sightseeing, outstation roundtrips, and Mahakal Darshan packages.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-secondary hover:text-white p-2 rounded-full transition-all flex items-center justify-center w-8 h-8"
                  aria-label="Facebook Link"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-secondary hover:text-white p-2 rounded-full transition-all flex items-center justify-center w-8 h-8"
                  aria-label="Instagram Link"
                >
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {settings.socialTwitter && (
                <a
                  href={settings.socialTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-secondary hover:text-white p-2 rounded-full transition-all flex items-center justify-center w-8 h-8"
                  aria-label="Twitter Link"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-whatsapp hover:text-white p-2 rounded-full transition-all flex items-center justify-center w-8 h-8"
                aria-label="WhatsApp Link"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Taxi Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors">Ujjain Local Taxi</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors">Mahakal Darshan Taxi</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors">Outstation Taxi Booking</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors">One-Way / Round-Trips</Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-accent transition-colors">Indore Airport pickup & drop</Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-accent transition-colors">Tempo Traveller Booking</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/fleet" className="hover:text-accent transition-colors">Our Fleet</Link></li>
              <li><Link href="/packages" className="hover:text-accent transition-colors">Tour Packages</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Travel Blog</Link></li>
              <li><Link href="/#about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/#reviews" className="hover:text-accent transition-colors">Customer Reviews</Link></li>
              <li><Link href="/policies" className="hover:text-accent transition-colors">Booking Policies</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center hover:text-accent transition-colors"
                title="Footer Call"
              >
                <Phone className="h-4 w-4 mr-2 text-secondary shrink-0" />
                <span>{settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 mr-2 text-secondary shrink-0" />
                <span>{settings.email}</span>
              </a>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-secondary shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-white block text-xs">Freeganj Office:</span>
                  <span className="text-xs text-gray-400">{settings.addressFreeganj}</span>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-secondary shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-white block text-xs">Nanakheda Branch:</span>
                  <span className="text-xs text-gray-400">{settings.addressNanakheda}</span>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Clock className="h-4 w-4 mr-2 text-secondary shrink-0" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policies & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-400 space-y-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/policies#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/policies#terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/policies#booking" className="hover:text-white transition-colors">Booking Policy</Link>
            <Link href="/policies#cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link>
            <Link href="/policies#refund" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/policies#disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} Ananya Express. All Rights Reserved. Crafted for Premium Ujjain Taxi & Tour Services.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
