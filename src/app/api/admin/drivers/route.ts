import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, drivers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, licenceNumber, licenceExpiry, availabilityStatus = 'Available', internalNotes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        phone,
        licenceNumber,
        licenceExpiry,
        availabilityStatus,
        internalNotes,
      },
    });

    return NextResponse.json({ success: true, driver });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
