import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// タイムの保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstTime, secondTime, thirdTime } = body;

    // バリデーション
    if (
      typeof firstTime !== 'number' ||
      typeof secondTime !== 'number' ||
      typeof thirdTime !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid time values' }, { status: 400 });
    }

    const sumTime = firstTime + secondTime + thirdTime;

    const time = await prisma.time.create({
      data: {
        firstTime,
        secondTime,
        thirdTime,
        sumTime,
      },
    });

    return NextResponse.json(time, { status: 201 });
  } catch (error) {
    console.error('Error creating time:', error);
    return NextResponse.json({ error: 'Failed to save time' }, { status: 500 });
  }
}

// 全タイムの取得
export async function GET() {
  try {
    const times = await prisma.time.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(times);
  } catch (error) {
    console.error('Error fetching times:', error);
    return NextResponse.json({ error: 'Failed to fetch times' }, { status: 500 });
  }
}
