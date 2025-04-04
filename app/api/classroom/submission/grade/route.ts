import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { submissionId, studentId, score } = await req.json();

    if (!submissionId || typeof score !== "number") {
      return new Response(JSON.stringify({ error: "Missing or invalid data" }), { status: 400 });
    }

    const existingGrade = await prisma.grade.findUnique({
      where: { submissionId },
    });

    let grade;
    if (existingGrade) {
      grade = await prisma.grade.update({
        where: { submissionId },
        data: {
          score,
          gradedAt: new Date(),
        },
      });
    } else {
      grade = await prisma.grade.create({
        data: {
          submissionId,
          studentId,
          score,
        },
      });
    }

    return Response.json({ grade });
  } catch (error) {
    console.error("Error grading submission:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
