import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
      hasAc,
      fuelType,
      localFare,
      outstationPerKm,
      driverAllowance,
      minKmRule,
      isActive,
      isAvailable,
      regNumber,
      insuranceExpiry,
      serviceDate,
      permitExpiry,
    } = body;

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        category: category !== undefined ? category : undefined,
        passengerCapacity: passengerCapacity !== undefined ? parseInt(passengerCapacity) : undefined,
        luggageCapacity: luggageCapacity !== undefined ? parseInt(luggageCapacity) : undefined,
        hasAc: hasAc !== undefined ? (hasAc === true) : undefined,
        fuelType: fuelType !== undefined ? fuelType : undefined,
        localFare: localFare !== undefined ? parseFloat(localFare) : undefined,
        outstationPerKm: outstationPerKm !== undefined ? parseFloat(outstationPerKm) : undefined,
        driverAllowance: driverAllowance !== undefined ? parseFloat(driverAllowance) : undefined,
        minKmRule: minKmRule !== undefined ? parseInt(minKmRule) : undefined,
        isActive: isActive !== undefined ? (isActive === true) : undefined,
        isAvailable: isAvailable !== undefined ? (isAvailable === true) : undefined,
        regNumber: regNumber !== undefined ? regNumber : undefined,
        insuranceExpiry: insuranceExpiry !== undefined ? insuranceExpiry : undefined,
        serviceDate: serviceDate !== undefined ? serviceDate : undefined,
        permitExpiry: permitExpiry !== undefined ? permitExpiry : undefined,
      },
    });

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully.' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
