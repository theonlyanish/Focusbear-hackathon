-- CreateTable
CREATE TABLE "UnlockRequest" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timePeriod" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnlockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnlockResponse" (
    "id" SERIAL NOT NULL,
    "unlockRequestId" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,
    "response" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "UnlockResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnlockResponse_unlockRequestId_friend_id_key" ON "UnlockResponse"("unlockRequestId", "friend_id");

-- AddForeignKey
ALTER TABLE "UnlockRequest" ADD CONSTRAINT "UnlockRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockResponse" ADD CONSTRAINT "UnlockResponse_unlockRequestId_fkey" FOREIGN KEY ("unlockRequestId") REFERENCES "UnlockRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockResponse" ADD CONSTRAINT "UnlockResponse_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
