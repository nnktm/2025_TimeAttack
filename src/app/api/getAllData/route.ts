import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const allTimes = await prisma.time.findMany({
      orderBy: {
        sumTime: 'asc', // 合計時間の昇順でソート
      },
    });

    return NextResponse.json(allTimes);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
