import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      packageId,
      passengers,
      travelDate,
      notes,
    } = body;

    // Validation
    if (!name || !phone || !packageId || !passengers || !travelDate) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const phoneClean = phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+91)?([6-9]\d{9})$/;
    if (!phoneRegex.test(phoneClean)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    let phoneDb = phoneClean;
    if (!phoneDb.startsWith('+91')) {
      phoneDb = '+91' + phoneDb;
    }

    // 1. Fetch package name for reference
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { error: 'Selected tour package does not exist.' },
        { status: 400 }
      );
    }

    // 2. Save enquiry
    const enquiry = await prisma.packageEnquiry.create({
      data: {
        name,
        phone: phoneDb,
        email: email || null,
        packageId,
        passengers: parseInt(passengers) || 1,
        travelDate,
        notes: notes || null,
        status: 'New',
      },
    });

    // 3. Create lead in CRM
    await prisma.lead.create({
      data: {
        title: `Package enquiry: ${tourPackage.name}`,
        customerName: name,
        phone: phoneDb,
        notes: `Tour: ${tourPackage.name} (${tourPackage.duration})\nTravel Date: ${travelDate}\nPassengers: ${passengers}\nMessage: ${notes || 'None'}`,
        priority: 'High', // Package tours are high-value leads
        stage: 'New',
      },
    });

    return NextResponse.json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error('Error creating package enquiry:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
