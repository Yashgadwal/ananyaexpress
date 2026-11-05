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
    const { stage, priority, followUpDate, notes, assignedTo } = body;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        stage: stage !== undefined ? stage : undefined,
        priority: priority !== undefined ? priority : undefined,
        followUpDate: followUpDate !== undefined ? followUpDate : undefined,
        notes: notes !== undefined ? notes : undefined,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined,
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Error updating lead:', error);
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

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
