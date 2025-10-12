import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request) => {
  try {
    const { id, secondTime } = (await req.json()) as {
      id: string;
      secondTime: number;
    };

    const newTime = await prisma.time.update({
      where: { id },
      data: { secondTime },
    });

    return NextResponse.json({ newTime });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
