const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.user.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.websiteSettings.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ananyaexpress.com',
      password: passwordHash,
      name: 'Ananya Admin',
      role: 'Admin',
    },
  });
  console.log('Created Admin User:', admin.email);

  // 3. Create Website Settings
  const settings = await prisma.websiteSettings.create({
    data: {
      id: 'settings',
      businessName: 'Ananya Express',
      phone: '+91 94250 82701',
      whatsApp: '+91 94250 82701',
      email: 'booking@ananyaexpress.com',
      addressFreeganj: 'Near BJP Office, Freeganj, Ujjain, Madhya Pradesh',
      addressNanakheda: 'A/1, New Abhishek Nagar, Nanakheda, Ujjain, Madhya Pradesh',
      businessHours: 'Open 24 Hours, 7 Days a Week',
      heroHeading: 'Reliable Taxi & Tour Services in Ujjain',
      heroDescription: 'Book clean cars, professional drivers and fixed-price travel services for local sightseeing, Mahakal Darshan, airport transfers and outstation trips.',
      aboutText: 'Ananya Express provides dependable taxi, car rental and tour services across Ujjain and nearby destinations. With professional drivers, clean vehicles, fixed pricing and 24-hour support, the company helps individuals, families and groups travel safely and comfortably.',
      experienceYears: 10,
      tripsCompleted: 15000,
      fleetSize: 25,
      socialFacebook: 'https://facebook.com/ananyaexpress',
      socialInstagram: 'https://instagram.com/ananyaexpress',
      socialTwitter: 'https://twitter.com/ananyaexpress',
      googleMapsFreeganj: 'https://maps.google.com/?q=BJP+Office+Freeganj+Ujjain',
      googleMapsNanakheda: 'https://maps.google.com/?q=Nanakheda+Ujjain',
      justdialLink: 'https://justdial.com',
      advancePaymentPercent: 20,
      upiId: 'ananya@upi',
      paymentGatewayActive: false,
      privacyPolicy: 'Your privacy is important to us. We only collect details required for your booking.',
      termsConditions: 'Toll, parking, and state tax are extra unless mentioned. Night charges apply after 10 PM.',
      bookingPolicy: 'Advance payment of 20% is required to confirm bookings.',
      cancellationPolicy: 'Free cancellation up to 24 hours before the trip start time.',
      refundPolicy: 'Refunds will be processed to the original payment mode within 5-7 business days.',
      driverDisclaimer: 'Vehicle model is subject to availability. An equivalent category vehicle will be provided if the requested model is unavailable.',
    },
  });
  console.log('Created Default Website Settings');

  // 4. Create Vehicles (Fleet)
  const vehiclesData = [
    {
      name: 'Swift Dzire or Similar',
      category: 'Sedan',
      imageJson: JSON.stringify(['/images/sedan.jpg']),
      passengerCapacity: 4,
      luggageCapacity: 2,
      hasAc: true,
      fuelType: 'CNG/Petrol',
      localFare: 1800, // starting rate for local package (e.g. 8hr/80km)
      outstationPerKm: 11.0,
      driverAllowance: 300,
      minKmRule: 250,
      isActive: true,
      isAvailable: true,
      regNumber: 'MP-13-CA-1234',
    },
    {
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

  const vehicles = [];
  for (const v of vehiclesData) {
    const created = await prisma.vehicle.create({ data: v });
    vehicles.push(created);
  }
  console.log(`Created ${vehicles.length} vehicles`);

  // 5. Create Tour Packages
  const packagesData = [
    {
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
          description: 'Start early morning at 8:00 AM with Mahakaleshwar Temple Bhasma Aarti / General Darshan. Visit Harsiddhi Temple, Kal Bhairav Temple (famous for offering liquor), Ram Ghat for Shipra River darshan, Mangalnath Temple, and Sandipani Ashram. Return by 7:00 PM.',
        },
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
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
          description: 'Early morning depart for Omkareshwar (140 km, ~4 hrs). Visit Omkareshwar Jyotirlinga on the Mandhata island, boat ride on the Narmada River, and Mamleshwar Temple. Return to Ujjain by night.',
        },
      ]),
      isFeatured: true,
      isPublished: true,
    },
    {
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
          description: 'Travel to Maheshwar (150 km). Tour the Maheshwar Palace/Fort, enjoy boat ride on Narmada River, buy traditional Maheshwari handloom sarees. Stay night in Maheshwar.',
        },
        {
          day: 3,
          title: 'Mandu Heritage & Return',
          description: 'Drive to Mandu (40 km). Tour Jahaz Mahal, Hindola Mahal, and Rani Roopmati Pavilion. Depart back to Indore or Ujjain for drop-off.',
        },
      ]),
      isFeatured: false,
      isPublished: true,
    },
  ];

  for (const pkg of packagesData) {
    await prisma.tourPackage.create({ data: pkg });
  }
  console.log('Created Tour Packages');

  // 6. Create FAQs
  const faqs = [
    {
      question: 'Is taxi service available 24 hours in Ujjain?',
      answer: 'Yes, Ananya Express provides 24/7 taxi booking services. You can call us or book online anytime.',
      category: 'General',
    },
    {
      question: 'Can you help with Mahakal Darshan booking?',
      answer: 'We assist our customers with local guidance, route planning, and prompt taxi drop-offs for Mahakaleshwar Temple and Bhasma Aarti. Regular VIP/General entry tickets must be booked online via the official temple website.',
      category: 'Booking',
    },
    {
      question: 'Are tolls, state taxes, and parking fees included in the price estimate?',
      answer: 'No, tolls, parking, and state border permits are separate and must be paid by the customer directly during the journey unless explicitly included in a customized package rate.',
      category: 'Payments',
    },
    {
      question: 'Do you provide airport transfers to Indore (IDR) Airport?',
      answer: 'Yes, we provide round-the-clock airport pickup and drop services between Ujjain and Indore Devi Ahilyabai Holkar Airport at fixed, transparent fares.',
      category: 'Booking',
    },
    {
      question: 'Can I book a Tempo Traveller for family or group tours?',
      answer: 'Yes, we have 12-seater to 17-seater well-maintained, fully air-conditioned Tempo Travellers available for group travel and pilgrimage tours.',
      category: 'General',
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('Created FAQs');

  // 7. Create Reviews (Real Testimonials)
  const reviews = [
    {
      customerName: 'Amit Sharma',
      rating: 5,
      reviewText: 'Very professional service. The driver was polite, knew all the routes in Ujjain, and the Ertiga was clean. Recommended for family travel.',
      travelType: 'Ujjain Sightseeing',
      dateText: 'June 2026',
      isFeatured: true,
      isApproved: true,
    },
    {
      customerName: 'Rajesh Patel',
      rating: 5,
      reviewText: 'Booked a one-way cab from Indore Airport to Ujjain. The cab arrived on time. Smooth ride and transparent billing.',
      travelType: 'Airport Transfer',
      dateText: 'May 2026',
      isFeatured: true,
      isApproved: true,
    },
    {
      customerName: 'Pooja Verma',
      rating: 5,
      reviewText: 'Excellent service for Omkareshwar trip. The driver made sure we had a safe travel and helped us with local details. Will book again.',
      travelType: 'Outstation Travel',
      dateText: 'July 2026',
      isFeatured: true,
      isApproved: true,
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }
  console.log('Created Reviews');

  // 8. Create Blog Posts
  const blogs = [
    {
      title: 'Complete Ujjain Sightseeing Guide: Top Places to Visit',
      slug: 'ujjain-sightseeing-guide',
      content: 'Ujjain, situated on the banks of the sacred Shipra River, is one of the most ancient and holy cities in India. Known as the City of Temples, it is home to the Shri Mahakaleshwar Jyotirlinga temple. In this guide, we walk you through the absolute must-visit attractions in Ujjain, including the newly built Mahakal Lok, Kal Bhairav temple where liquor is offered, Harsiddhi temple (one of the 51 Shaktipeethas), Ram Ghat, and Mangalnath temple (known as the birthplace of Mars). Learn the best times to visit, local customs, and transport tips to make your tour comfortable.',
      featuredImage: '/images/mahakal_lok.jpg',
      category: 'Ujjain Travel Guide',
      seoTitle: 'Ultimate Ujjain Sightseeing Guide | Best Places to Visit',
      seoDescription: 'Discover the top temples, ghats, and tourist destinations in Ujjain. Learn how to plan your sightseeing tour with Ananya Express.',
      author: 'Ananya Team',
    },
    {
      title: 'How to Plan Your Mahakaleshwar Jyotirlinga Darshan',
      slug: 'mahakal-darshan-guide',
      content: 'Visiting Mahakaleshwar Jyotirlinga in Ujjain is a divine experience. To make your darshan smooth, you should be aware of a few guidelines. Bhasma Aarti is the most sought-after ritual, occurring daily from 4:00 AM to 6:00 AM. Advance online registration is highly recommended. For regular darshan, online VIP tickets (Sheeghra Darshan) can save you hours of waiting in line. Remember that traditional Indian clothing is mandatory for entering the sanctum (Garbhagriha). Read on for details on locker facilities, mobile phone rules, and how our taxi service can help you arrive hassle-free.',
      featuredImage: '/images/temple_darshan.jpg',
      category: 'Mahakal Darshan Guide',
      seoTitle: 'Guide to Mahakaleshwar Jyotirlinga Darshan & Bhasma Aarti',
      seoDescription: 'A complete step-by-step guide for booking Bhasma Aarti, VIP entry passes, and managing travel for Mahakaleshwar Darshan.',
      author: 'Ananya Team',
    },
  ];

  for (const b of blogs) {
    await prisma.blogPost.create({ data: b });
  }
  console.log('Created Blog Posts');

  // 9. Add a couple of Demo Bookings and Leads
  const customer = await prisma.customer.create({
    data: {
      name: 'Rohan Gupta',
      phone: '+91 9876543210',
      whatsApp: '+91 9876543210',
      email: 'rohan.gupta@example.com',
      marketingConsent: true,
    },
  });

  await prisma.booking.create({
    data: {
      bookingRef: 'MTB-1001',
      customerId: customer.id,
      pickupLocation: 'Indore Airport (IDR)',
      destination: 'Hotel near Mahakal Lok, Ujjain',
      pickupDate: '2026-07-25',
      pickupTime: '10:30',
      tripType: 'Airport Transfer',
      passengerCount: 3,
      vehicleId: vehicles[0].id, // Sedan
      estimatedFare: 2000,
      paymentStatus: 'Pending',
      bookingStatus: 'New Enquiry',
      bookingSource: 'Website',
      internalNotes: 'Customer requested driver who speaks English.',
    },
  });

  await prisma.lead.create({
    data: {
      title: 'Tempo Traveller booking for family of 10',
      customerName: 'Vijay Mehra',
      phone: '+91 9999888877',
      notes: 'Wants to book a Tempo Traveller for Ujjain local and Omkareshwar on 28th July.',
      priority: 'High',
      stage: 'New',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
