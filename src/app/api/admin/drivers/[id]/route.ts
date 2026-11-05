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
    const { name, phone, licenceNumber, licenceExpiry, availabilityStatus, internalNotes } = body;

    const updated = await prisma.driver.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        licenceNumber: licenceNumber !== undefined ? licenceNumber : undefined,
        licenceExpiry: licenceExpiry !== undefined ? licenceExpiry : undefined,
        availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
      },
    });

    return NextResponse.json({ success: true, driver: updated });
  } catch (error) {
    console.error('Error updating driver:', error);
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

    await prisma.driver.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Driver deleted successfully.' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
