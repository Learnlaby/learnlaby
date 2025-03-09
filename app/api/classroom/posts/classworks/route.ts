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

        // Check if classroom exists
        const classroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: { id: true, name: true }
        });

        if (!classroom) {
            return new Response(
                JSON.stringify({ error: "Classroom not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is a member of the classroom
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId }
        });

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch assignments for the classroom
        const assignments = await prisma.post.findMany({
            where: { 
                classroomId, 
                type: { in: ["assignment", "material"] }
            },
            select: {
                id: true,
                title: true,
                content: true,
                fileUrl: true,
                dueDate: true,
                createdAt: true,
                type: true
            },
            orderBy: { createdAt: "desc" }
        });
        

        return new Response(
            JSON.stringify({ classroom: classroom.name, assignments }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error fetching classwork assignments:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch classwork assignments." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
