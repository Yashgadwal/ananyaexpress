import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Verify admin session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();

    const updated = await prisma.websiteSettings.upsert({
      where: { id: 'settings' },
      update: {
        businessName: body.businessName,
        phone: body.phone,
        whatsApp: body.whatsApp,
        email: body.email,
        addressFreeganj: body.addressFreeganj,
        addressNanakheda: body.addressNanakheda,
        businessHours: body.businessHours,
        heroHeading: body.heroHeading,
        heroDescription: body.heroDescription,
        aboutText: body.aboutText,
        experienceYears: parseInt(body.experienceYears) || 0,
        tripsCompleted: parseInt(body.tripsCompleted) || 0,
        fleetSize: parseInt(body.fleetSize) || 0,
        socialFacebook: body.socialFacebook,
        socialInstagram: body.socialInstagram,
        socialTwitter: body.socialTwitter,
        googleMapsFreeganj: body.googleMapsFreeganj,
        googleMapsNanakheda: body.googleMapsNanakheda,
        justdialLink: body.justdialLink,
        advancePaymentPercent: parseInt(body.advancePaymentPercent) || 0,
        upiId: body.upiId,
        paymentGatewayActive: body.paymentGatewayActive === true,
        privacyPolicy: body.privacyPolicy,
        termsConditions: body.termsConditions,
        bookingPolicy: body.bookingPolicy,
        cancellationPolicy: body.cancellationPolicy,
        refundPolicy: body.refundPolicy,
        driverDisclaimer: body.driverDisclaimer,
      },
      create: {
        id: 'settings',
        businessName: body.businessName || 'Ananya Express',
        phone: body.phone || '+91 94250 82701',
        whatsApp: body.whatsApp || '+91 94250 82701',
        email: body.email || 'booking@ananyaexpress.com',
        addressFreeganj: body.addressFreeganj || 'Freeganj',
        addressNanakheda: body.addressNanakheda || 'Nanakheda',
        businessHours: body.businessHours || '24 Hours',
        heroHeading: body.heroHeading || '',
        heroDescription: body.heroDescription || '',
        aboutText: body.aboutText || '',
        experienceYears: parseInt(body.experienceYears) || 10,
        tripsCompleted: parseInt(body.tripsCompleted) || 15000,
        fleetSize: parseInt(body.fleetSize) || 25,
        socialFacebook: body.socialFacebook,
        socialInstagram: body.socialInstagram,
        socialTwitter: body.socialTwitter,
        googleMapsFreeganj: body.googleMapsFreeganj,
        googleMapsNanakheda: body.googleMapsNanakheda,
        justdialLink: body.justdialLink,
        advancePaymentPercent: parseInt(body.advancePaymentPercent) || 20,
        upiId: body.upiId || '',
        paymentGatewayActive: body.paymentGatewayActive === true,
        privacyPolicy: body.privacyPolicy,
        termsConditions: body.termsConditions,
        bookingPolicy: body.bookingPolicy,
        cancellationPolicy: body.cancellationPolicy,
        refundPolicy: body.refundPolicy,
        driverDisclaimer: body.driverDisclaimer,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
