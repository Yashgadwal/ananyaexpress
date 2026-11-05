'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Menu, X, Car } from 'lucide-react';

interface NavbarProps {
  settings: {
    businessName: string;
    phone: string;
    whatsApp: string;
  };
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Fleet', href: '/fleet' },
    { label: 'Tour Packages', href: '/packages' },
    { label: 'Sightseeing', href: '/#sightseeing' },
    { label: 'Contact', href: '/#contact' },
  ];

  // Helper to format WhatsApp URL
  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20want%20to%20enquire%20about%20a%20taxi%20booking.`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-1.5' : 'bg-white/95 md:bg-transparent md:backdrop-blur-sm py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <img src="/images/logo.png" alt="Ananya Express" className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-lg bg-white p-0.5 shadow-sm border border-gray-150" />
            <div>
              <span className="text-base font-extrabold tracking-tight text-primary font-display block leading-none">
                Ananya
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary block mt-0.5">
                Express
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-5 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-primary hover:text-secondary font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center text-primary hover:text-secondary font-bold text-xs transition-colors"
              title="Header Call"
            >
              <Phone className="h-3.5 w-3.5 mr-1 text-secondary" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-1.5 px-3 rounded-lg flex items-center shadow-sm text-xs transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/#booking-form"
              className="bg-secondary hover:bg-secondary-light text-white font-bold py-1.5 px-4.5 rounded-lg shadow-sm text-xs transition-all hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href={`tel:${settings.phone}`}
              className="p-2 text-primary-light hover:text-secondary"
              title="Header Call Mobile"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-charcoal hover:text-primary hover:bg-light-bg focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-inner px-4 pt-2 pb-6 space-y-3 absolute top-full left-0 w-full animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-semibold text-charcoal hover:bg-light-bg hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="bg-primary text-white font-bold py-3 px-4 rounded-lg text-center flex items-center justify-center space-x-2 text-sm"
              title="Mobile Menu Call"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp text-white font-bold py-3 px-4 rounded-lg text-center flex items-center justify-center space-x-2 text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>
          <Link
            href="/#booking-form"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg text-center text-sm shadow-md"
          >
            Book Your Taxi
          </Link>
        </div>
      )}
    </header>
  );
}
