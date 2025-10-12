import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// ランキングの取得（合計タイムの昇順）
export async function GET() {
  try {
    const ranking = await prisma.time.findMany({
      orderBy: {
        sumTime: 'asc',
      },
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json({ error: 'Failed to fetch ranking' }, { status: 500 });
  }
}
