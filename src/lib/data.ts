import prisma from './db';

export interface VehicleData {
  id: string;
  name: string;
  category: string;
  imageJson: string;
  passengerCapacity: number;
  luggageCapacity: number;
  hasAc: boolean;
  fuelType: string;
  localFare: number;
  outstationPerKm: number;
  driverAllowance: number;
  minKmRule: number;
  isActive: boolean;
  isAvailable: boolean;
  regNumber?: string | null;
}

export interface TourPackageData {
  id: string;
  name: string;
  duration: string;
  featuredImage: string;
  galleryJson: string;
  startingPrice: number;
  placesCoveredJson: string;
  inclusionsJson: string;
  exclusionsJson: string;
  itineraryJson: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
}

export interface FAQData {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
}

export interface ReviewData {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  travelType: string;
  dateText: string;
  isFeatured: boolean;
  isApproved: boolean;
  sourceLink?: string | null;
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  category: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status: string;
  author: string;
  createdAt: Date;
}

export interface PromoBannerData {
  id: string;
  heading: string;
  description: string;
  imagePath?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
}

export const defaultVehicles: VehicleData[] = [
  {
    id: 'veh-1',
    name: 'Swift Dzire or Similar',
    category: 'Sedan',
    imageJson: JSON.stringify(['/images/sedan.jpg']),
    passengerCapacity: 4,
    luggageCapacity: 2,
    hasAc: true,
    fuelType: 'CNG/Petrol',
    localFare: 1800,
    outstationPerKm: 11.0,
    driverAllowance: 300,
    minKmRule: 250,
    isActive: true,
    isAvailable: true,
    regNumber: 'MP-13-CA-1234',
  },
  {
    id: 'veh-2',
    name: 'Ertiga or Similar',
    category: 'SUV',
    imageJson: JSON.stringify(['/images/suv.jpg']),
    passengerCapacity: 6,
    luggageCapacity: 3,
    hasAc: true,
    fuelType: 'Diesel',
    localFare: 2400,
    outstationPerKm: 14.0,
    driverAllowance: 350,
    minKmRule: 250,
    isActive: true,
    isAvailable: true,
    regNumber: 'MP-13-CB-5678',
  },
  {
    id: 'veh-3',
    name: 'Innova Crysta or Similar',
    category: 'Premium SUV',
    imageJson: JSON.stringify(['/images/premium_suv.jpg']),
    passengerCapacity: 7,
    luggageCapacity: 4,
    hasAc: true,
    fuelType: 'Diesel',
    localFare: 3500,
    outstationPerKm: 18.0,
    driverAllowance: 400,
    minKmRule: 300,
    isActive: true,
    isAvailable: true,
    regNumber: 'MP-13-CC-9012',
  },
  {
    id: 'veh-4',
    name: 'Tempo Traveller',
    category: 'Tempo Traveller',
    imageJson: JSON.stringify(['/images/tempo.jpg']),
    passengerCapacity: 12,
    luggageCapacity: 8,
    hasAc: true,
    fuelType: 'Diesel',
    localFare: 5000,
    outstationPerKm: 24.0,
    driverAllowance: 500,
    minKmRule: 300,
    isActive: true,
    isAvailable: true,
    regNumber: 'MP-13-CD-3456',
  },
];

export const defaultPackages: TourPackageData[] = [
  {
    id: 'pkg-1',
    name: 'Mahakal Darshan & Ujjain Local Sightseeing',
    duration: '1 Day',
    featuredImage: '/images/mahakal.jpg',
    galleryJson: JSON.stringify(['/images/mahakal.jpg', '/images/harsiddhi.jpg']),
    startingPrice: 1800,
    placesCoveredJson: JSON.stringify([
      'Mahakaleshwar Temple',
      'Harsiddhi Temple',
      'Kal Bhairav Temple',
      'Ram Ghat',
      'Mangalnath Temple',
      'Sandipani Ashram',
    ]),
    inclusionsJson: JSON.stringify(['AC Vehicle', 'Fuel & Driver Charges', 'Local Sightseeing Guidance']),
    exclusionsJson: JSON.stringify(['Toll & Parking', 'Temple VIP Entry Tickets', 'Meals & Personal Expenses']),
    itineraryJson: JSON.stringify([
      {
        day: 1,
        title: 'Ujjain Pilgrimage Tour',
        description: 'Start early morning at 8:00 AM with Mahakaleshwar Temple Bhasma Aarti / General Darshan. Visit Harsiddhi Temple, Kal Bhairav Temple, Ram Ghat for Shipra River darshan, Mangalnath Temple, and Sandipani Ashram. Return by 7:00 PM.',
      },
    ]),
    isFeatured: true,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'pkg-2',
    name: 'Ujjain & Omkareshwar Jyotirlinga Tour',
    duration: '2 Days',
    featuredImage: '/images/omkareshwar.jpg',
    galleryJson: JSON.stringify(['/images/omkareshwar.jpg', '/images/mahakal.jpg']),
    startingPrice: 4800,
    placesCoveredJson: JSON.stringify([
      'Mahakaleshwar Jyotirlinga',
      'Kal Bhairav',
      'Omkareshwar Jyotirlinga',
      'Mamleshwar Temple',
      'Narmada River Boat Ride',
    ]),
    inclusionsJson: JSON.stringify(['AC Sedan/SUV for 2 Days', 'Driver Night Stay Allowance', 'Fuel Charges']),
    exclusionsJson: JSON.stringify(['Toll, State Tax & Parking', 'Hotel Stay', 'Guide Fees']),
    itineraryJson: JSON.stringify([
      {
        day: 1,
        title: 'Mahakal Darshan & Ujjain Local',
        description: 'Pick up from Ujjain Railway Station, check in to hotel. Complete Mahakal Lok and Temple tour, Harsiddhi Temple, and Kal Bhairav Temple. Stay night in Ujjain.',
      },
      {
        day: 2,
        title: 'Omkareshwar Excursion',
        description: 'Early morning depart for Omkareshwar (140 km). Visit Omkareshwar Jyotirlinga on Mandhata island, boat ride on Narmada River, and Mamleshwar Temple. Return to Ujjain by night.',
      },
    ]),
    isFeatured: true,
    isPublished: true,
    createdAt: new Date(),
  },
  {
    id: 'pkg-3',
    name: 'Ujjain - Maheshwar - Mandu Heritage Tour',
    duration: '3 Days',
    featuredImage: '/images/maheshwar.jpg',
    galleryJson: JSON.stringify(['/images/maheshwar.jpg', '/images/mandu.jpg']),
    startingPrice: 8500,
    placesCoveredJson: JSON.stringify([
      'Ujjain Temples',
      'Maheshwar Fort & Narmada Ghats',
      'Jahaz Mahal Mandu',
      'Rani Roopmati Pavilion',
    ]),
    inclusionsJson: JSON.stringify(['AC Vehicle for 3 Days', 'Fuel and Driver Allowance', 'Interstate/Local Permits']),
    exclusionsJson: JSON.stringify(['Toll and Parking', 'Entry Tickets to monuments', 'Accommodation']),
    itineraryJson: JSON.stringify([
      {
        day: 1,
        title: 'Arrival in Ujjain',
        description: 'Pick up and local temple darshan in Ujjain.',
      },
      {
        day: 2,
        title: 'Drive to Maheshwar',
        description: 'Travel to Maheshwar (150 km). Tour Maheshwar Palace/Fort, enjoy boat ride on Narmada River. Stay night in Maheshwar.',
      },
      {
        day: 3,
        title: 'Mandu Heritage & Return',
        description: 'Drive to Mandu (40 km). Tour Jahaz Mahal, Hindola Mahal, and Rani Roopmati Pavilion. Depart back for drop-off.',
      },
    ]),
    isFeatured: false,
    isPublished: true,
    createdAt: new Date(),
  },
];

export const defaultFaqs: FAQData[] = [
  {
    id: 'faq-1',
    question: 'Is taxi service available 24 hours in Ujjain?',
    answer: 'Yes, Ananya Express provides 24/7 taxi booking services. You can call us or book online anytime.',
    category: 'General',
    isPublished: true,
  },
  {
    id: 'faq-2',
    question: 'Can you help with Mahakal Darshan booking?',
    answer: 'We assist our customers with local guidance, route planning, and prompt taxi drop-offs for Mahakaleshwar Temple and Bhasma Aarti. Regular VIP/General entry tickets must be booked online via the official temple website.',
    category: 'Booking',
    isPublished: true,
  },
  {
    id: 'faq-3',
    question: 'Are tolls, state taxes, and parking fees included in the price estimate?',
    answer: 'No, tolls, parking, and state border permits are separate and must be paid by the customer directly during the journey unless explicitly included in a customized package rate.',
    category: 'Payments',
    isPublished: true,
  },
  {
    id: 'faq-4',
    question: 'Do you provide airport transfers to Indore (IDR) Airport?',
    answer: 'Yes, we provide round-the-clock airport pickup and drop services between Ujjain and Indore Devi Ahilyabai Holkar Airport at fixed, transparent fares.',
    category: 'Booking',
    isPublished: true,
  },
  {
    id: 'faq-5',
    question: 'Can I book a Tempo Traveller for family or group tours?',
    answer: 'Yes, we have 12-seater to 17-seater well-maintained, fully air-conditioned Tempo Travellers available for group travel and pilgrimage tours.',
    category: 'General',
    isPublished: true,
  },
];

export const defaultReviews: ReviewData[] = [
  {
    id: 'rev-1',
    customerName: 'Amit Sharma',
    rating: 5,
    reviewText: 'Very professional service. The driver was polite, knew all the routes in Ujjain, and the Ertiga was clean. Recommended for family travel.',
    travelType: 'Ujjain Sightseeing',
    dateText: 'June 2026',
    isFeatured: true,
    isApproved: true,
  },
  {
    id: 'rev-2',
    customerName: 'Rajesh Patel',
    rating: 5,
    reviewText: 'Booked a one-way cab from Indore Airport to Ujjain. The cab arrived on time. Smooth ride and transparent billing.',
    travelType: 'Airport Transfer',
    dateText: 'May 2026',
    isFeatured: true,
    isApproved: true,
  },
  {
    id: 'rev-3',
    customerName: 'Pooja Verma',
    rating: 5,
    reviewText: 'Excellent service for Omkareshwar trip. The driver made sure we had a safe travel and helped us with local details. Will book again.',
    travelType: 'Outstation Travel',
    dateText: 'July 2026',
    isFeatured: true,
    isApproved: true,
  },
];

export const defaultBlogs: BlogPostData[] = [
  {
    id: 'blog-1',
    title: 'Complete Ujjain Sightseeing Guide: Top Places to Visit',
    slug: 'ujjain-sightseeing-guide',
    content: 'Ujjain, situated on the banks of the sacred Shipra River, is one of the most ancient and holy cities in India. Known as the City of Temples, it is home to the Shri Mahakaleshwar Jyotirlinga temple. In this guide, we walk you through the absolute must-visit attractions in Ujjain, including the newly built Mahakal Lok, Kal Bhairav temple where liquor is offered, Harsiddhi temple (one of the 51 Shaktipeethas), Ram Ghat, and Mangalnath temple (known as the birthplace of Mars). Learn the best times to visit, local customs, and transport tips to make your tour comfortable.',
    featuredImage: '/images/mahakal_lok.jpg',
    category: 'Ujjain Travel Guide',
    seoTitle: 'Ultimate Ujjain Sightseeing Guide | Best Places to Visit',
    seoDescription: 'Discover the top temples, ghats, and tourist destinations in Ujjain. Learn how to plan your sightseeing tour with Ananya Express.',
    status: 'Published',
    author: 'Ananya Team',
    createdAt: new Date(),
  },
  {
    id: 'blog-2',
    title: 'How to Plan Your Mahakaleshwar Jyotirlinga Darshan',
    slug: 'mahakal-darshan-guide',
    content: 'Visiting Mahakaleshwar Jyotirlinga in Ujjain is a divine experience. To make your darshan smooth, you should be aware of a few guidelines. Bhasma Aarti is the most sought-after ritual, occurring daily from 4:00 AM to 6:00 AM. Advance online registration is highly recommended. For regular darshan, online VIP tickets (Sheeghra Darshan) can save you hours of waiting in line. Remember that traditional Indian clothing is mandatory for entering the sanctum (Garbhagriha). Read on for details on locker facilities, mobile phone rules, and how our taxi service can help you arrive hassle-free.',
    featuredImage: '/images/temple_darshan.jpg',
    category: 'Mahakal Darshan Guide',
    seoTitle: 'Guide to Mahakaleshwar Jyotirlinga Darshan & Bhasma Aarti',
    seoDescription: 'A complete step-by-step guide for booking Bhasma Aarti, VIP entry passes, and managing travel for Mahakaleshwar Darshan.',
    status: 'Published',
    author: 'Ananya Team',
    createdAt: new Date(),
  },
];

export async function getVehicles(): Promise<VehicleData[]> {
  try {
    const list = await prisma.vehicle.findMany({ where: { isActive: true } });
    if (list && list.length > 0) return list;
  } catch (error) {
    console.warn('Prisma getVehicles fallback:', error);
  }
  return defaultVehicles;
}

export async function getTourPackages(): Promise<TourPackageData[]> {
  try {
    const list = await prisma.tourPackage.findMany({
      where: { isPublished: true },
      orderBy: { isFeatured: 'desc' },
    });
    if (list && list.length > 0) return list;
  } catch (error) {
    console.warn('Prisma getTourPackages fallback:', error);
  }
  return defaultPackages;
}

export async function getFAQs(): Promise<FAQData[]> {
  try {
    const list = await prisma.fAQ.findMany({ where: { isPublished: true } });
    if (list && list.length > 0) return list;
  } catch (error) {
    console.warn('Prisma getFAQs fallback:', error);
  }
  return defaultFaqs;
}

export async function getReviews(): Promise<ReviewData[]> {
  try {
    const list = await prisma.review.findMany({ where: { isApproved: true } });
    if (list && list.length > 0) return list;
  } catch (error) {
    console.warn('Prisma getReviews fallback:', error);
  }
  return defaultReviews;
}

export async function getBlogPosts(): Promise<BlogPostData[]> {
  try {
    const list = await prisma.blogPost.findMany({
      where: { status: 'Published' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    if (list && list.length > 0) return list;
  } catch (error) {
    console.warn('Prisma getBlogPosts fallback:', error);
  }
  return defaultBlogs;
}

export async function getPromoBanners(): Promise<PromoBannerData[]> {
  try {
    const list = await prisma.promoBanner.findMany({ where: { isActive: true } });
    if (list) return list;
  } catch (error) {
    console.warn('Prisma getPromoBanners fallback:', error);
  }
  return [];
}

export async function getVehicleById(id: string): Promise<VehicleData | null> {
  try {
    const item = await prisma.vehicle.findUnique({ where: { id } });
    if (item) return item;
  } catch (error) {
    console.warn('Prisma getVehicleById fallback:', error);
  }
  return defaultVehicles.find((v) => v.id === id) || null;
}

export async function getTourPackageById(id: string): Promise<TourPackageData | null> {
  try {
    const item = await prisma.tourPackage.findUnique({ where: { id } });
    if (item) return item;
  } catch (error) {
    console.warn('Prisma getTourPackageById fallback:', error);
  }
  return defaultPackages.find((p) => p.id === id) || null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostData | null> {
  try {
    const item = await prisma.blogPost.findUnique({ where: { slug } });
    if (item) return item;
  } catch (error) {
    console.warn('Prisma getBlogPostBySlug fallback:', error);
  }
  return defaultBlogs.find((b) => b.slug === slug) || null;
}
