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

    const { postId } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: "postId is required" }), { status: 400 });
    }

    // Find the assignment and its classroom
    const assignment = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        maxScore: true,
        classroomId: true,
        createdAt: true,
        dueDate: true,
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
    });

    if (!assignment) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), { status: 404 });
    }

    const classroomId = assignment.classroomId;

    // Check if the user is a member of the classroom
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, image: true, name: true },
    });

    const isMember = await prisma.classroomMember.findFirst({
      where: { userId: user?.id, classroomId },
    });

    if (!isMember) {
      return new Response(JSON.stringify({ error: "Forbidden: Not a classroom member" }), { status: 403 });
    }

    // Fetch all student members of the classroom
    const students = await prisma.classroomMember.findMany({
      where: { classroomId, role: "student" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    const studentList = students.map((m) => ({
      id: m.user.id,
      name: m.user.name || "Unknown",
      email: m.user.email,
      image: m.user.image,
    }));

    return Response.json({
      assignment,
      students: studentList,
    });

  } catch (error) {
    console.error("Error fetching assignment submission data:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
