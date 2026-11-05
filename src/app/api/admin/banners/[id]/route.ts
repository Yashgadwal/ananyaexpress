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
    const { isActive } = body;

    const updated = await prisma.promoBanner.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? (isActive === true) : undefined,
      },
    });

    return NextResponse.json({ success: true, banner: updated });
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

    await prisma.promoBanner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Banner deleted.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
