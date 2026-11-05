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
      bookingStatus,
      paymentStatus,
      finalFare,
      assignedVehicleId,
      assignedDriverId,
      internalNotes,
      updatedBy = 'Admin',
      statusChangeNote = '',
    } = body;

    // 1. Get original booking to verify status changes
    const originalBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!originalBooking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    // 2. Perform Update
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: bookingStatus || originalBooking.bookingStatus,
        paymentStatus: paymentStatus || originalBooking.paymentStatus,
        finalFare: finalFare !== undefined ? parseFloat(finalFare) : originalBooking.finalFare,
        assignedVehicleId: assignedVehicleId !== undefined ? assignedVehicleId : originalBooking.assignedVehicleId,
        assignedDriverId: assignedDriverId !== undefined ? assignedDriverId : originalBooking.assignedDriverId,
        internalNotes: internalNotes !== undefined ? internalNotes : originalBooking.internalNotes,
      },
    });

    // 3. Log history if status changed
    if (bookingStatus && bookingStatus !== originalBooking.bookingStatus) {
      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: id,
          status: bookingStatus,
          updatedBy,
          notes: statusChangeNote || `Status updated from "${originalBooking.bookingStatus}" to "${bookingStatus}".`,
        },
      });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Error updating booking:', error);
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

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
