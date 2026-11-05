import prisma from '@/lib/db';
import { getWebsiteSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyBottomBar from '@/components/StickyBottomBar';
import BookingForm from '@/components/BookingForm';
import FareCalculator from '@/components/FareCalculator';
import RatingStars from '@/components/RatingStars';
import Link from 'next/link';
import { 
  Phone, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  MapPin, 
  Compass, 
  Star, 
  Award, 
  ChevronRight, 
  MessageCircle, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  HeartHandshake,
  Car
} from 'lucide-react';

export const revalidate = 0; // Disable caching to ensure real-time admin updates appear instantly

export default async function HomePage() {
  const settings = await getWebsiteSettings();
  
  // Fetch active items
  const vehicles = await prisma.vehicle.findMany({
    where: { isActive: true }
  });

  const packages = await prisma.tourPackage.findMany({
    where: { isPublished: true },
    orderBy: { isFeatured: 'desc' }
  });

  const faqs = await prisma.fAQ.findMany({
    where: { isPublished: true }
  });

  const reviews = await prisma.review.findMany({
    where: { isApproved: true }
  });

  const blogs = await prisma.blogPost.findMany({
    where: { status: 'Published' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const promoBanners = await prisma.promoBanner.findMany({
    where: { isActive: true }
  });

  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20want%20to%20enquire%20about%20a%20taxi%20booking.`;

  // Popular Services Grid
  const services = [
    {
      title: 'Ujjain Local Taxi',
      desc: 'Clean cars for local running, shopping and office transfers in Ujjain.',
      startPrice: '1,800',
    },
    {
      title: 'Mahakal Darshan Taxi',
      desc: 'Hassle-free transfers and drop-offs to Mahakaleshwar Jyotirlinga & local temples.',
      startPrice: '1,200',
    },
    {
      title: 'Ujjain Sightseeing',
      desc: 'Full-day tours covering Kal Bhairav, Harsiddhi, Ram Ghat, Mangalnath and more.',
      startPrice: '1,800',
    },
    {
      title: 'Outstation Taxi',
      desc: 'One-way and round-trip taxi service to Indore, Omkareshwar, Bhopal, Mandu, etc.',
      startPrice: '11/km',
    },
    {
      title: 'Indore Airport Transfer',
      desc: 'Comfortable 24/7 airport pick and drop services between Indore (IDR) and Ujjain.',
      startPrice: '2,000',
    },
    {
      title: 'Tempo Traveller Booking',
      desc: '12 to 17 seater premium AC Tempo Travellers for group tours and family pilgrimages.',
      startPrice: '5,000',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Section 1: Announcement Bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            <span>24/7 Taxi Booking Available in Ujjain</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`tel:${settings.phone}`} className="flex items-center font-bold text-accent hover:underline" title="Header Call">
              <Phone className="h-3 w-3 mr-1" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-light">{settings.businessHours}</span>
          </div>
        </div>
      </div>

      {/* Section 2: Header */}
      <Navbar settings={settings} />

      {/* Promo Banner (If exists) */}
      {promoBanners.length > 0 && (
        <div className="bg-secondary text-white text-center py-2.5 px-4 font-semibold text-sm animate-pulse flex items-center justify-center space-x-2">
          <span>🔥 {promoBanners[0].heading}: {promoBanners[0].description}</span>
          {promoBanners[0].ctaLink && (
            <Link href={promoBanners[0].ctaLink} className="underline text-accent ml-2 text-xs font-bold hover:text-white transition-colors">
              {promoBanners[0].ctaText || 'View Offer'}
            </Link>
          )}
        </div>
      )}

      {/* Section 3: Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white pt-12 pb-24 px-4 overflow-hidden border-b-8 border-secondary">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing Saffron & Saffron Circle Details */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-accent/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full py-1.5 px-4 text-xs font-bold text-accent tracking-wider uppercase">
              ✨ Trusted Travel Partner in Ujjain
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight">
              {settings.heroHeading}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {settings.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="#booking-form"
                className="bg-secondary hover:bg-secondary-light text-white font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-all hover:scale-105 text-center flex items-center justify-center space-x-2"
              >
                <span>Book Your Taxi</span>
                <ArrowRight className="h-4 w-4 text-accent" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-colors text-center flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Get Price on WhatsApp</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <Clock className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-gray-300">Open 24 Hours</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-gray-300">Safe Drivers</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-gray-300">Fixed Pricing</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start">
                <HeartHandshake className="h-5 w-5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-gray-300">Clean Vehicles</span>
              </div>
            </div>
          </div>

          {/* Hero Premium Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="h-40 relative overflow-hidden">
                <img src="/images/premium_suv.jpg" alt="Premium SUV Taxi" className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-0 right-0 bg-secondary text-white font-bold text-xs uppercase px-3 py-1 rounded-bl-xl z-10">
                  Best Rates Guaranteed
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold font-display text-accent mb-2">Darshan Special Packages</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Explore Shri Mahakaleshwar temple, Kal Bhairav temple, and the scenic Shipra River ghats with our customizable local packages starting from just Rs 1,800.
                </p>
              
              <div className="space-y-3.5 mb-6 text-sm text-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 shrink-0" />
                  <span>No cancellation charge up to 24 hours</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 shrink-0" />
                  <span>GPS enabled, clean, sanitized cars</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 shrink-0" />
                  <span>Experienced local tour guides (drivers)</span>
                </div>
              </div>

              <a
                href={`tel:${settings.phone}`}
                className="block w-full text-center bg-accent hover:bg-accent-light text-primary font-bold py-3 rounded-lg text-sm shadow-md transition-colors"
                title="Hero Call"
              >
                📞 Call to Book: {settings.phone}
              </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 4: Quick Booking Form (Overlap) */}
      <section className="-mt-16 px-4 relative z-10">
        <BookingForm vehicles={vehicles} settings={settings} />
      </section>

      {/* Section 5: Popular Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">What We Do</span>
          <h2 className="text-3xl font-bold text-primary font-display mb-3">Our Popular Taxi Services</h2>
          <p className="text-gray-600 text-sm">
            Whether you need a quick ride from the railway station, a day-long sightseeing package, or outstation tour bookings, we have got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="bg-primary/5 p-3 rounded-lg text-primary inline-block mb-4 group-hover:bg-primary group-hover:text-accent transition-colors">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-primary font-display mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                <span className="text-xs text-gray-500 font-semibold uppercase">Starting from</span>
                <span className="text-base font-bold text-secondary font-display">Rs {service.startPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Our Fleet */}
      <section id="fleet" className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Our Ride Options</span>
            <h2 className="text-3xl font-bold text-primary font-display mb-3">Explore Our Fleet</h2>
            <p className="text-gray-600 text-sm">
              We provide neat, well-maintained, and air-conditioned vehicles suited for couples, families, and larger tourist groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((v) => {
              let vehicleImage = '';
              try {
                if (v.imageJson) {
                  const images = JSON.parse(v.imageJson);
                  if (Array.isArray(images) && images.length > 0) {
                    vehicleImage = images[0];
                  }
                }
              } catch (e) {}

              return (
                <div key={v.id} className="bg-slate-50 rounded-xl overflow-hidden shadow border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="bg-slate-200 h-48 w-full relative flex items-center justify-center text-gray-400 overflow-hidden">
                      {vehicleImage ? (
                        <img src={vehicleImage} alt={v.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Car className="h-16 w-16 mx-auto mb-2 text-primary" />
                          <span className="text-xs font-semibold text-primary/80 uppercase block">{v.category}</span>
                        </div>
                      )}
                    </div>
                  
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="inline-block bg-primary/10 text-primary text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full mb-1">
                        {v.category}
                      </span>
                      <h3 className="text-base font-bold text-primary font-display leading-snug">{v.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-charcoal">
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 shrink-0"></span>
                        <span>{v.passengerCapacity} Passengers</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 shrink-0"></span>
                        <span>{v.luggageCapacity} Bags</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 shrink-0"></span>
                        <span>{v.hasAc ? 'AC Enabled' : 'Non-AC'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5 shrink-0"></span>
                        <span>{v.fuelType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 bg-white space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-center pt-4">
                    <div className="bg-slate-50 p-2 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">Local Package</span>
                      <span className="text-sm font-bold text-primary">Rs {v.localFare}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">Outstation</span>
                      <span className="text-sm font-bold text-secondary">Rs {v.outstationPerKm}/km</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-gray-500 bg-gray-50 p-2 rounded">
                    <div>• Min. KM rule: {v.minKmRule} km/day</div>
                    <div>• Driver Allowance: Rs {v.driverAllowance}/day</div>
                  </div>

                  <Link
                    href={`/fleet#booking-form`}
                    className="block w-full text-center bg-secondary hover:bg-secondary-light text-white font-bold py-2 rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Section 7: Popular Tour Packages */}
      <section id="packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Pilgrimage & Holidays</span>
          <h2 className="text-3xl font-bold text-primary font-display mb-3">Popular Ujjain Tour Packages</h2>
          <p className="text-gray-600 text-sm">
            Make the most of your religious pilgrimage with our curated itineraries covering Mahakaleshwar temple, Omkareshwar, Indore, and historical landmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const places = JSON.parse(pkg.placesCoveredJson) as string[];
            const inclusions = JSON.parse(pkg.inclusionsJson) as string[];
            return (
              <div key={pkg.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between">
                <div>
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
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Key Places Covered:</span>
                      <div className="flex flex-wrap gap-1">
                        {places.slice(0, 4).map((p, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-charcoal py-0.5 px-2 rounded-md font-medium border border-gray-200">
                            {p}
                          </span>
                        ))}
                        {places.length > 4 && (
                          <span className="text-[11px] text-gray-500 py-0.5 px-2">+{places.length - 4} more</span>
                        )}
                      </div>
                    </div>

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

                <div className="p-6 pt-0 border-t border-gray-50 bg-slate-50/50">
                  <div className="flex justify-between items-center py-4">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Tour Cost from</span>
                      <span className="text-xl font-extrabold text-secondary font-display">Rs {pkg.startingPrice}</span>
                    </div>
                    <Link
                      href={`/packages`}
                      className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center"
                    >
                      <span>Details</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 8: Ujjain Sightseeing Highlights */}
      <section id="sightseeing" className="bg-slate-900 text-white py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs uppercase font-bold text-accent tracking-wider block">Divine City Tour</span>
              <h2 className="text-3xl font-bold font-display text-white">Plan Your Ujjain Sightseeing</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ujjain is a land of spirituality and heritage. Explore the sacred temples, take part in the historic Shipra River rituals, and witness the newly opened grand Mahakal Lok corridor.
              </p>
              
              <div className="space-y-3.5 text-sm text-gray-300">
                <div className="flex items-start">
                  <span className="bg-secondary/20 text-secondary p-1 rounded mr-3 shrink-0 mt-0.5">✔</span>
                  <span><strong>Shri Mahakaleshwar:</strong> Dedicated to Lord Shiva, one of the 12 Jyotirlingas, famous for the live Bhasma Aarti.</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-secondary/20 text-secondary p-1 rounded mr-3 shrink-0 mt-0.5">✔</span>
                  <span><strong>Kal Bhairav:</strong> Ancient temple where liquor is offered to the deity as a traditional ritual.</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-secondary/20 text-secondary p-1 rounded mr-3 shrink-0 mt-0.5">✔</span>
                  <span><strong>Harsiddhi Temple:</strong> Sacred Shaktipeeth, beautifully lit during Navratri festivals.</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-secondary/20 text-secondary p-1 rounded mr-3 shrink-0 mt-0.5">✔</span>
                  <span><strong>Ram Ghat:</strong> Famous riverfront on the Shipra, offering beautiful evening aartis.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="#booking-form"
                  className="inline-block bg-accent hover:bg-accent-light text-primary font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-all"
                >
                  Create Custom Sightseeing Tour
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Sightseeing Places Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Shri Mahakaleshwar', desc: 'Active Jyotirlinga' },
                  { name: 'Kal Bhairav', desc: 'Liquor Offering' },
                  { name: 'Harsiddhi Temple', desc: '51 Shaktipeethas' },
                  { name: 'Ram Ghat', desc: 'Shipra River Aarti' },
                  { name: 'Mangalnath', desc: 'Birthplace of Mars' },
                  { name: 'Mahakal Lok', desc: 'Grand Heritage Corridor' }
                ].map((place, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <span className="text-xs text-accent uppercase font-bold tracking-wider">Spot #{i+1}</span>
                    <h4 className="text-base font-bold font-display text-white mt-1">{place.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{place.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Our Promise</span>
          <h2 className="text-3xl font-bold text-primary font-display mb-3">Why Choose Ananya Express</h2>
          <p className="text-gray-600 text-sm">
            We work tirelessly to ensure that your local and outstation taxi rides in Ujjain are comfortable, safe, and transparently priced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Professional Drivers', desc: 'Experienced, polite, and verified local drivers who know the routes and temples.' },
            { title: 'Clean & Sanitized Cars', desc: 'Vehicles are rigorously inspected, washed, and sanitized before every customer pickup.' },
            { title: 'Fixed & Transparent Pricing', desc: 'No hidden taxes or charges. What we quote is what you pay. Transparent fare break-ups.' },
            { title: '24/7 Booking Support', desc: 'Round-the-clock telephone and WhatsApp team available to assist with bookings or changes.' },
            { title: 'Local Ujjain Expertise', desc: 'Deep knowledge of Ujjain temple schedules, Aarti timings, and nearby excursion spots.' },
            { title: 'Vehicles for Every Group', desc: 'Couples, families, or tour groups—we have cars (Sedans, SUVs, Tempo Travellers) for all.' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:border-secondary transition-all">
              <h3 className="text-lg font-bold text-primary font-display mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 10: How Booking Works */}
      <section className="bg-slate-100 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Simple Process</span>
            <h2 className="text-3xl font-bold text-primary font-display mb-3">How Booking Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { step: '1', title: 'Enter Details', desc: 'Select trip type, pick/drop locations, dates, and vehicle preference in our form.' },
              { step: '2', title: 'Select Vehicle', desc: 'Choose the car category that fits your passenger and luggage requirements.' },
              { step: '3', title: 'Confirm Quote', desc: 'Get live estimates, check details via phone/WhatsApp, and confirm booking.' },
              { step: '4', title: 'Enjoy Journey', desc: 'Get driver and vehicle assignment details and enjoy a safe and comfortable ride.' }
            ].map((s, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow border border-gray-100 relative">
                <div className="w-10 h-10 bg-secondary text-white font-extrabold rounded-full flex items-center justify-center mx-auto mb-4 text-base font-display">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-primary font-display mb-2">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Fare Estimate Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Calculate Live Rates</span>
          <h2 className="text-3xl font-bold text-primary font-display mb-3">Price Estimate Calculator</h2>
          <p className="text-gray-600 text-sm">
            Enter your destination distance and choose a vehicle to calculate estimated travel costs instantly.
          </p>
        </div>

        <FareCalculator vehicles={vehicles} settings={settings} />
      </section>

      {/* Section 12: Customer Reviews */}
      {reviews.length > 0 && (
        <section id="reviews" className="bg-white py-16 border-t border-gray-100 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Customer Testimonials</span>
              <h2 className="text-3xl font-bold text-primary font-display mb-3">What Our Customers Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((r) => (
                <div key={r.id} className="bg-slate-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-primary text-sm font-display">{r.customerName}</span>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      "{r.reviewText}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/50 flex justify-between text-xs text-gray-400 font-semibold">
                    <span>{r.travelType}</span>
                    <span>{r.dateText}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href={settings.justdialLink || 'https://google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-colors"
              >
                Read More Reviews
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Section 13: About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="bg-primary text-white rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-bold text-accent tracking-wider block">About Our Company</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">About Ananya Express</h2>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                {settings.aboutText}
              </p>
              
              <div className="pt-2 text-sm text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>🏢 <strong>Primary Office:</strong> {settings.addressFreeganj}</div>
                <div>📍 <strong>Branch Office:</strong> {settings.addressNanakheda}</div>
              </div>
            </div>

            {/* Statistics Section (shows dynamic values) */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-2xl font-extrabold text-accent block font-display">{settings.experienceYears}+</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Years Exp</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-2xl font-extrabold text-accent block font-display">{(settings.tripsCompleted / 1000).toFixed(0)}k+</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Trips Done</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-accent block font-display">{settings.fleetSize}+</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Fleet Size</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 14: Service Areas */}
      <section className="bg-slate-100 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-primary uppercase tracking-wider mb-6">
            We Serve All Key Locations in Ujjain
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Freeganj',
              'Nanakheda',
              'Mahakal Area',
              'Indore Road',
              'Dewas Road',
              'Railway Station Area',
              'Ujjain Airport Transfer',
              'Indore Airport Transfer',
              'Ujjain to Indore',
              'Ujjain to Omkareshwar',
              'Ujjain to Maheshwar',
              'Ujjain to Mandu'
            ].map((area, index) => (
              <span key={index} className="bg-white text-charcoal py-1.5 px-4 rounded-full text-xs font-semibold shadow-sm border border-gray-200">
                📍 Taxi Service in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 15: Frequently Asked Questions */}
      {faqs.length > 0 && (
        <section id="faqs" className="max-w-4xl mx-auto px-4 py-16 scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Got Questions?</span>
            <h2 className="text-3xl font-bold text-primary font-display">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-bold text-primary text-sm sm:text-base mb-2 font-display">
                  Q: {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-secondary">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 16: Contact and Locations */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 border-t border-gray-200">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Find Us</span>
          <h2 className="text-3xl font-bold text-primary font-display mb-3">Our Office Locations</h2>
          <p className="text-gray-600 text-sm">
            Visit us or call our local offices in Ujjain for booking assistance and custom tour consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Office 1: Freeganj */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Primary Head Office
              </span>
              <h3 className="text-lg font-bold text-primary font-display">Freeganj Branch</h3>
              <p className="text-sm text-gray-600 flex items-start">
                <MapPin className="h-4.5 w-4.5 text-secondary shrink-0 mr-2 mt-0.5" />
                <span>{settings.addressFreeganj}</span>
              </p>
              <div className="text-xs text-gray-400 font-semibold">• Located near BJP Office Freeganj</div>
            </div>
            
            <div className="pt-4 border-t border-gray-50 flex gap-2.5">
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 text-center bg-primary hover:bg-primary-light text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
                title="Office Call"
              >
                Call Office
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={settings.googleMapsFreeganj || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
              >
                Directions
              </a>
            </div>
          </div>

          {/* Office 2: Nanakheda */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                Branch Location
              </span>
              <h3 className="text-lg font-bold text-primary font-display">Nanakheda Branch</h3>
              <p className="text-sm text-gray-600 flex items-start">
                <MapPin className="h-4.5 w-4.5 text-secondary shrink-0 mr-2 mt-0.5" />
                <span>{settings.addressNanakheda}</span>
              </p>
              <div className="text-xs text-gray-400 font-semibold">• Located in New Abhishek Nagar</div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex gap-2.5">
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 text-center bg-primary hover:bg-primary-light text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
                title="Office Call"
              >
                Call Office
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={settings.googleMapsNanakheda || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-2.5 rounded-lg text-xs shadow-sm transition-colors"
              >
                Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 17: Final CTA */}
      <section className="bg-gradient-to-r from-secondary to-secondary-light text-white py-16 px-4 text-center relative overflow-hidden border-t-8 border-primary">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display">Planning a Trip from Ujjain?</h2>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Get a clean vehicle, professional driver, and transparent pricing for your next local or outstation journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
            <Link
              href="#booking-form"
              className="bg-primary hover:bg-primary-light text-white font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-all hover:scale-105"
            >
              Get Instant Quote
            </Link>
            <a
              href={`tel:${settings.phone}`}
              className="bg-white hover:bg-slate-50 text-primary font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-colors flex items-center justify-center space-x-2"
              title="CTA Call"
            >
              <Phone className="h-4 w-4 text-secondary" />
              <span>Call Now</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-lg text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Blog Posts Preview Section */}
      {blogs.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold text-secondary tracking-wider block mb-2">Travel Tips & Guides</span>
              <h2 className="text-3xl font-bold text-primary font-display mb-3">Our Travel Blog</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <div key={b.id} className="bg-slate-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    {b.featuredImage && (
                      <div className="h-44 overflow-hidden relative">
                        <img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                        {b.category}
                      </span>
                      <h3 className="text-base font-bold text-primary font-display leading-snug hover:text-secondary">
                        <Link href={`/blog/${b.slug}`}>{b.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {b.content}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0 border-t border-gray-200/50 flex justify-between items-center text-xs text-gray-400 bg-white/50">
                    <span>By {b.author}</span>
                    <Link href={`/blog/${b.slug}`} className="text-secondary font-bold hover:underline flex items-center">
                      Read Guide <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 18: Footer */}
      <Footer settings={settings} />

      {/* Sticky Mobile Bottom Bar */}
      <StickyBottomBar settings={settings} />

    </div>
  );
}
