/*
  Warnings:

  - You are about to drop the column `teamId` on the `Grade` table. All the data in the column will be lost.
  - You are about to drop the column `isTeamAssignment` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isTeamAssignment";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";
