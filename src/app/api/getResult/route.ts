import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const newTime = await prisma.time.findUnique({
      where: { id },
    });
    if (!newTime) {
      return NextResponse.json({ error: 'Time not found' }, { status: 404 });
    }

    return NextResponse.json({
      firstTime: newTime.firstTime,
      secondTime: newTime.secondTime,
      thirdTime: newTime.thirdTime,
      sumTime: newTime.sumTime,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
