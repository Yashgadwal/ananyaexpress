import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tripType,
      pickupLocation,
      destination,
      pickupDate,
      pickupTime,
      returnDate,
      passengerCount,
      vehicleId,
      customerName,
      customerPhone,
      customerEmail,
      specialRequest,
      bookingSource = 'Website',
      estimatedFare = 0,
    } = body;

    // Server-side validation
    if (!tripType || !pickupLocation || !destination || !pickupDate || !pickupTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Phone validation (+91 Indian format)
    const phoneClean = customerPhone.replace(/\s+/g, '');
    const phoneRegex = /^(\+91)?([6-9]\d{9})$/;
    if (!phoneRegex.test(phoneClean)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // 1. Find or create Customer
    // Standardize phone number format for DB
    let phoneDb = phoneClean;
    if (!phoneDb.startsWith('+91')) {
      phoneDb = '+91' + phoneDb;
    }

    let customer = await prisma.customer.findUnique({
      where: { phone: phoneDb },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: phoneDb,
          whatsApp: phoneDb, // default WhatsApp to the phone number
          email: customerEmail || null,
          marketingConsent: true,
        },
      });
    } else {
      // Update name and email if provided
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName,
          email: customerEmail || customer.email,
        },
      });
    }

    // 2. Generate Booking Reference
    const count = await prisma.booking.count();
    const bookingRef = `MTB-${1001 + count}`;

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        customerId: customer.id,
        pickupLocation,
        destination,
        pickupDate,
        pickupTime,
        returnDate: returnDate || null,
        tripType,
        passengerCount: parseInt(passengerCount) || 1,
        vehicleId: vehicleId || null,
        specialRequest: specialRequest || null,
        estimatedFare: parseFloat(estimatedFare) || 0,
        bookingStatus: 'New Enquiry',
        bookingSource,
        paymentStatus: 'Pending',
      },
    });

    // 4. Create History
    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        status: 'New Enquiry',
        updatedBy: 'System',
        notes: `Enquiry submitted successfully via ${bookingSource}.`,
      },
    });

    // 5. Create Lead automatically in CRM
    await prisma.lead.create({
      data: {
        title: `Booking enquiry: ${tripType} trip to ${destination}`,
        customerName,
        phone: phoneDb,
        notes: `Pickup: ${pickupLocation}\nDate/Time: ${pickupDate} @ ${pickupTime}\nVehicle Preference: ${vehicleId ? 'Assigned' : 'None'}\nDetails: ${specialRequest || 'None'}`,
        priority: 'Medium',
        stage: 'New',
      },
    });

    return NextResponse.json({
      success: true,
      bookingRef,
      booking,
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
