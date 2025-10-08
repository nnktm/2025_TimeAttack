import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 特定のタイムの取得
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const time = await prisma.time.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!time) {
      return NextResponse.json({ error: 'Time not found' }, { status: 404 });
    }

    return NextResponse.json(time);
  } catch (error) {
    console.error('Error fetching time:', error);
    return NextResponse.json({ error: 'Failed to fetch time' }, { status: 500 });
  }
}

// タイムの削除
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.time.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Time deleted successfully' });
  } catch (error) {
    console.error('Error deleting time:', error);
    return NextResponse.json({ error: 'Failed to delete time' }, { status: 500 });
  }
}

// タイムの更新
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { firstTime, secondTime, thirdTime } = body;

    const updateData: {
      firstTime?: number;
      secondTime?: number;
      thirdTime?: number;
      sumTime?: number;
    } = {};

    if (firstTime !== undefined) updateData.firstTime = firstTime;
    if (secondTime !== undefined) updateData.secondTime = secondTime;
    if (thirdTime !== undefined) updateData.thirdTime = thirdTime;

    // いずれかのタイムが更新される場合は合計も再計算
    if (Object.keys(updateData).length > 0) {
      const currentTime = await prisma.time.findUnique({
        where: { id: params.id },
      });

      if (!currentTime) {
        return NextResponse.json({ error: 'Time not found' }, { status: 404 });
      }

      updateData.sumTime =
        (updateData.firstTime ?? currentTime.firstTime) +
        (updateData.secondTime ?? currentTime.secondTime) +
        (updateData.thirdTime ?? currentTime.thirdTime);
    }

    const time = await prisma.time.update({
      where: {
        id: params.id,
      },
      data: updateData,
    });

    return NextResponse.json(time);
  } catch (error) {
    console.error('Error updating time:', error);
    return NextResponse.json({ error: 'Failed to update time' }, { status: 500 });
  }
}
