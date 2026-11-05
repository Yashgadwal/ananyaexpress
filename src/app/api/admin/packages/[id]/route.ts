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
    const { isFeatured, isPublished, startingPrice } = body;

    const updated = await prisma.tourPackage.update({
      where: { id },
      data: {
        isFeatured: isFeatured !== undefined ? (isFeatured === true) : undefined,
        isPublished: isPublished !== undefined ? (isPublished === true) : undefined,
        startingPrice: startingPrice !== undefined ? parseFloat(startingPrice) : undefined,
      },
    });

    return NextResponse.json({ success: true, tourPackage: updated });
  } catch (error) {
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

    await prisma.tourPackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Package deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
