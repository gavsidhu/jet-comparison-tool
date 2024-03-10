/*
  Warnings:

  - You are about to drop the `Jet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Jet";

-- CreateTable
CREATE TABLE "jets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "wingspan" DOUBLE PRECISION NOT NULL,
    "engines" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jets_pkey" PRIMARY KEY ("id")
);
