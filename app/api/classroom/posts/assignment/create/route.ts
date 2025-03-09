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

        // Find the logged-in user's ID
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

        // Parse request body
        const bodyText = await request.text();
        const { classroomId, title, content, dueDate, points } = JSON.parse(bodyText);

        // Validate required fields
        if (!classroomId || !title) {
            return new Response(
                JSON.stringify({ error: "Classroom ID and title are required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is a member of the classroom
        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId }
        });

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create the assignment
        const assignment = await prisma.post.create({
            data: {
                classroomId,
                userId: user.id,
                type: "assignment",
                title,
                content,
                dueDate: dueDate ? new Date(dueDate) : null, // Convert dueDate to a Date object
                fileUrl: null,
                isTeamAssignment: false
            }
        });

        return new Response(
            JSON.stringify(assignment),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error creating assignment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create assignment." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
