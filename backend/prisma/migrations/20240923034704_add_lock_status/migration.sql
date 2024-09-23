-- CreateTable
CREATE TABLE "LockStatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "unlockedUntil" TIMESTAMP(3),

    CONSTRAINT "LockStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LockStatus_userId_key" ON "LockStatus"("userId");

-- AddForeignKey
ALTER TABLE "LockStatus" ADD CONSTRAINT "LockStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
