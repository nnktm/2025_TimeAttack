import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request) => {
  try {
    const { id, firstTime } = (await req.json()) as {
      id: string;
      firstTime: number;
    };

    // 現在のデータを取得
    const currentData = await prisma.time.findUnique({
      where: { id },
    });

    if (!currentData) {
      return NextResponse.json({ error: 'Time not found' }, { status: 404 });
    }

    // sumTimeを計算
    const sumTime = firstTime + currentData.secondTime + currentData.thirdTime;

    const newTime = await prisma.time.update({
      where: { id },
      data: {
        firstTime,
        sumTime,
      },
    });

    return NextResponse.json({ newTime });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
