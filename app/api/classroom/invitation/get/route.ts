import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const email = session.user.email;

    const invitations = await prisma.invitation.findMany({
      where: {
        receiverEmail: email,
      },
      include: {
        classroom: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            image: true,
            startDate: true,
            endDate: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
