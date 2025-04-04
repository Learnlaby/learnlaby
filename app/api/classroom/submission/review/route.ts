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

    const { submissionId } = await req.json();

    if (!submissionId) {
      return new Response(JSON.stringify({ error: "Missing submissionId" }), { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        files: true,
        grade: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), { status: 404 });
    }

    return Response.json({ submission });
  } catch (error) {
    console.error("Error fetching submission for review:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}