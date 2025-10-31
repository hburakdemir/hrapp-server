/*
  Warnings:

  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Candidate" DROP CONSTRAINT "Candidate_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Form" DROP CONSTRAINT "Form_candidateId_fkey";

-- DropTable
DROP TABLE "public"."Candidate";

-- DropTable
DROP TABLE "public"."Form";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "note" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_userId_key" ON "candidates"("userId");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
