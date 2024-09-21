/*
  Warnings:

  - You are about to drop the `email-change` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email-verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password-reset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email-change" DROP CONSTRAINT "email-change_userId_fkey";

-- DropForeignKey
ALTER TABLE "email-verification" DROP CONSTRAINT "email-verification_userId_fkey";

-- DropForeignKey
ALTER TABLE "password-reset" DROP CONSTRAINT "password-reset_userId_fkey";

-- DropTable
DROP TABLE "email-change";

-- DropTable
DROP TABLE "email-verification";

-- DropTable
DROP TABLE "password-reset";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "invitation_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'pending',
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "reason" TEXT,
    "timePeriod" INTEGER,
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
