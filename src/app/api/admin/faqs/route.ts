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

    const faqs = await prisma.fAQ.findMany();
    return NextResponse.json({ success: true, faqs });
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
    const { question, answer, category = 'General', isPublished = true } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        isPublished: isPublished === true,
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
