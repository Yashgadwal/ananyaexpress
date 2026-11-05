import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ananya Express | Best Taxi & Car Rental Service in Ujjain',
  description: 'Book reliable, safe, and clean cabs in Ujjain. Offering local sightseeing, Mahakal Darshan taxi, outstation one-way/round-trips, Indore airport transfers, and Tempo Travellers at transparent, fixed rates. Available 24/7.',
  keywords: 'Taxi service in Ujjain, Car rental in Ujjain, Ujjain taxi booking, Mahakal Darshan taxi, Outstation cab from Ujjain, Tempo Traveller in Ujjain, Indore Airport to Ujjain taxi, travel agency in Ujjain',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-charcoal">
        {children}
      </body>
    </html>
  );
}
