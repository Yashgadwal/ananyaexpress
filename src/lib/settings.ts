import prisma from './db';

export async function getWebsiteSettings() {
  try {
    const settings = await prisma.websiteSettings.findUnique({
      where: { id: 'settings' },
    });
    if (settings) return settings;
  } catch (error) {
    console.error('Error fetching settings from DB:', error);
  }

  // Fallback default settings matching business info
  return {
    id: 'settings',
    logoUrl: '/images/logo.png',
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
    justdialLink: '',
    advancePaymentPercent: 20,
    upiId: 'ananya@upi',
    paymentGatewayActive: false,
    privacyPolicy: 'Your privacy is important to us. We only collect details required for your booking.',
    termsConditions: 'Toll, parking, and state tax are extra unless mentioned. Night charges apply after 10 PM.',
    bookingPolicy: 'Advance payment of 20% is required to confirm bookings.',
    cancellationPolicy: 'Free cancellation up to 24 hours before the trip start time.',
    refundPolicy: 'Refunds will be processed to the original payment mode within 5-7 business days.',
    driverDisclaimer: 'Vehicle model is subject to availability. An equivalent category vehicle will be provided if the requested model is unavailable.',
  };
}
