import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please log in first." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const bodyText = await request.text();
    const { classroomId } = JSON.parse(bodyText);

    if (!classroomId) {
      return new Response(
        JSON.stringify({ error: "Classroom ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isMember = await prisma.classroomMember.findFirst({
      where: { userId: user.id, classroomId },
    });

    if (!isMember) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Not a classroom member." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch students (members with role 'student')
    const students = await prisma.classroomMember.findMany({
      where: { classroomId, role: "student" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    // Fetch assignments and include submissions with grades
    const assignments = await prisma.post.findMany({
      where: { classroomId, type: "assignment" },
      select: {
        id: true,
        title: true,
        maxScore: true,
        dueDate: true,
        createdAt: true,
        submissions: {
          select: {
            id: true,
            submittedAt: true,
            studentId: true,
            grade: {
              select: { score: true, gradedAt: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map students with their submissions
    const studentList = students.map((member) => ({
      id: member.user.id,
      name: member.user.name || "Unknown",
      email: member.user.email,
      image: member.user.image,
    }));

    return new Response(
      JSON.stringify({ assignments, students: studentList }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching classroom assignment data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch classroom data." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
