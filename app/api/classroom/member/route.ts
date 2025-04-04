import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Authenticate the user
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. Please log in first." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Parse request body
        const bodyText = await request.text();
        const { classroomId } = JSON.parse(bodyText);

        if (!classroomId) {
            return new Response(
                JSON.stringify({ error: "Classroom ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the classroom exists
        const classroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: { id: true, name: true }
        });

        if (!classroom) {
            return new Response(
                JSON.stringify({ error: `Classroom with ID ${classroomId} not found.` }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Retrieve all members of the classroom (students, teachers, co-teachers)
        const members = await prisma.classroomMember.findMany({
            where: { classroomId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return new Response(
            JSON.stringify({
                members: members.map(member => ({
                    id: member.user.id,
                    name: member.user.name || "Unknown",
                    email: member.user.email,
                    role: member.role, // 'student', 'teacher', 'co-teacher'
                    image: member.user.image || null
                }))
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error fetching classroom members:", error);
        return new Response(
            JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
