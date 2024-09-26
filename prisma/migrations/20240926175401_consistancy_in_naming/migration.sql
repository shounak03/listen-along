/*
  Warnings:

  - You are about to drop the column `userID` on the `Stream` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_userID_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "userID",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
