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
    const { question, answer, category, isPublished } = body;

    const updated = await prisma.fAQ.update({
      where: { id },
      data: {
        question: question !== undefined ? question : undefined,
        answer: answer !== undefined ? answer : undefined,
        category: category !== undefined ? category : undefined,
        isPublished: isPublished !== undefined ? (isPublished === true) : undefined,
      },
    });

    return NextResponse.json({ success: true, faq: updated });
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

    await prisma.fAQ.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
