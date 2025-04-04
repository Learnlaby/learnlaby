import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // Get user session
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Extract the classroom code from request body
        const { classroomCode } = await req.json();

        if (!classroomCode) {
            return new Response("Classroom code is required", { status: 400 });
        }

        // Find the logged-in user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Find the classroom by code
        const classroom = await prisma.classroom.findUnique({
            where: { code: classroomCode },
            select: { id: true }
        });

        if (!classroom) {
            return new Response("Invalid classroom code", { status: 404 });
        }

        // Check if the user is already a member
        const existingMember = await prisma.classroomMember.findFirst({
            where: {
                classroomId: classroom.id,
                userId: user.id
            }
        });

        if (existingMember) {
            return new Response("User is already a member of this classroom", { status: 400 });
        }

        // Create a new ClassroomMember entry with role "student"
        await prisma.classroomMember.create({
            data: {
                classroomId: classroom.id,
                userId: user.id,
                role: "student" // Assign the role
            }
        });

        return new Response("User successfully joined the classroom", { status: 201 });
    } catch (error) {
        console.error("Error joining classroom:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
