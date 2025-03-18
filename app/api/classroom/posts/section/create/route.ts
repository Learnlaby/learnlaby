import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Authenticate the user
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
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
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Parse request body
        const { classroomId, name } = await request.json();

        // Validate required fields
        if (!classroomId || !name) {
            return new Response(
                JSON.stringify({ error: "Classroom ID and section name are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is a member of the classroom
        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId }
        });

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member" }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log(name, classroomId);

        // Create the section
        const section = await prisma.section.create({
            data: { name, classroomId }
        });

        return new Response(
            JSON.stringify(section),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error creating section:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create section" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
