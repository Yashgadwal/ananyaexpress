import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { note, createdBy = 'Admin' } = await request.json();
    if (!note) {
      return NextResponse.json({ error: 'Note content is required.' }, { status: 400 });
    }

    const followUp = await prisma.leadFollowUp.create({
      data: {
        leadId: id,
        note,
        createdBy,
      },
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error('Error adding follow-up note:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
