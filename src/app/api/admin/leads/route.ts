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

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { followUps: true },
    });

    return NextResponse.json({ success: true, leads });
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
    const { title, customerName, phone, notes, priority = 'Medium', stage = 'New' } = body;

    if (!title || !customerName || !phone) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        title,
        customerName,
        phone,
        notes,
        priority,
        stage,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
