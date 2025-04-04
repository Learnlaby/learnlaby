import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!sender) {
      return new Response("Sender not found", { status: 404 });
    }

    const body = await req.json();
    const { classroomId, invitations } = body as {
      classroomId: string;
      invitations: { email: string; role: "student" | "co-teacher" | "teacher" }[];
    };

    if (!classroomId || !Array.isArray(invitations)) {
      return new Response("Invalid request body", { status: 400 });
    }

    const responses: { email: string; message: string }[] = [];

    for (const invite of invitations) {
      const { email, role } = invite;

      if (!email || !role) {
        responses.push({ email, message: "Invalid invite data" });
        continue;
      }

      const existingInvite = await prisma.invitation.findFirst({
        where: {
          senderId: sender.id,
          receiverEmail: email,
          classroomId: classroomId,
        },
      });

      if (existingInvite) {
        responses.push({ email, message: "Already invited" });
        continue;
      }

      await prisma.invitation.create({
        data: {
          senderId: sender.id,
          receiverEmail: email,
          classroomId,
          role,
        },
      });

      responses.push({ email, message: "Invitation sent" });
    }

    return Response.json({ result: responses }, { status: 200 });
  } catch (error) {
    console.error("Error sending invitations:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
