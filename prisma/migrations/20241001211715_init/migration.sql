-- CreateEnum
CREATE TYPE "TypesOfInterest" AS ENUM ('SIMPLE', 'COMPOSITE');

-- CreateEnum
CREATE TYPE "StatusAccountPayable" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "accounts_payable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capital" MONEY NOT NULL,
    "rate" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "type" "TypesOfInterest" NOT NULL,
    "totalInterest" MONEY,
    "status" "StatusAccountPayable" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_payable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "totalPaid" MONEY NOT NULL,
    "accruedInterest" MONEY NOT NULL,
    "installmentValue" MONEY NOT NULL,
    "itPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts_payable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
