import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request) => {
  try {
    const { id } = (await req.json()) as {
      id: string;
    };

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 指定されたIDのデータを取得
    const timeData = await prisma.time.findUnique({
      where: { id },
    });

    if (!timeData) {
      return NextResponse.json({ error: 'Time not found' }, { status: 404 });
    }

    // sumTimeを計算
    const sumTime = timeData.firstTime + timeData.secondTime + timeData.thirdTime;

    // sumTimeを更新
    const updatedTime = await prisma.time.update({
      where: { id },
      data: { sumTime },
    });

    return NextResponse.json({
      id: updatedTime.id,
      firstTime: updatedTime.firstTime,
      secondTime: updatedTime.secondTime,
      thirdTime: updatedTime.thirdTime,
      sumTime: updatedTime.sumTime,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
