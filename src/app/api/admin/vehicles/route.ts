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

    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, vehicles });
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
    const {
      name,
      category,
      passengerCapacity,
      luggageCapacity,
      hasAc = true,
      fuelType,
      localFare,
      outstationPerKm,
      driverAllowance,
      minKmRule = 250,
      isActive = true,
      isAvailable = true,
      regNumber,
      insuranceExpiry,
      serviceDate,
      permitExpiry,
    } = body;

    if (!name || !category || !localFare || !outstationPerKm || !driverAllowance) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        category,
        imageJson: JSON.stringify([]),
        passengerCapacity: parseInt(passengerCapacity) || 4,
        luggageCapacity: parseInt(luggageCapacity) || 2,
        hasAc: hasAc === true,
        fuelType: fuelType || 'Diesel',
        localFare: parseFloat(localFare) || 0,
        outstationPerKm: parseFloat(outstationPerKm) || 0,
        driverAllowance: parseFloat(driverAllowance) || 0,
        minKmRule: parseInt(minKmRule) || 250,
        isActive: isActive === true,
        isAvailable: isAvailable === true,
        regNumber,
        insuranceExpiry,
        serviceDate,
        permitExpiry,
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
