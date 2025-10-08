-- CreateTable
CREATE TABLE "Time" (
    "id" TEXT NOT NULL,
    "firstTime" INTEGER NOT NULL,
    "secondTime" INTEGER NOT NULL,
    "thirdTime" INTEGER NOT NULL,
    "sumTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);
