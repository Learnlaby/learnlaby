import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const submission = await prisma.submission.findFirst({
    where: {
      postId,
      studentId: user.id
    },
    include: {
      files: true
    }
  });

  return Response.json(submission || null);
}