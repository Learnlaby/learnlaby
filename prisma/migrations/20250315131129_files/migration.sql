/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Submission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_submissionId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "fileUrl";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "fileUrl";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT,
    "submissionId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
