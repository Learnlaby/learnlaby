// api/classroom/submissions/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { postId } = await req.json();

  const submissions = await prisma.submission.findMany({
    where: { postId },
    include: {
      student: true,
      grade: true,
    },
  });

  return Response.json(submissions);
}
