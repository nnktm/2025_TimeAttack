import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async () => {
  const newTime = await prisma.time.create({
    data: {
      firstTime: 0,
      secondTime: 0,
      thirdTime: 0,
      sumTime: 0,
    },
  });
  return NextResponse.json({ id: newTime.id }, { status: 200 });
};
