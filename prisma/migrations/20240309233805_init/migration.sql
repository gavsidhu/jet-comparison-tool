-- CreateTable
CREATE TABLE "Jet" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "wingspan" DOUBLE PRECISION NOT NULL,
    "engines" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jet_pkey" PRIMARY KEY ("id")
);
