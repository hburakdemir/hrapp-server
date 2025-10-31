-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CANDIDATE', 'HR', 'ADMIN');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "note" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
