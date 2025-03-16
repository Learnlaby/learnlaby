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
        const { classroomId } = await request.json();

        if (!classroomId) {
            return new Response(
                JSON.stringify({ error: "Classroom ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
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
        
        // Now use the correct userId
        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId }
        });
        

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch all sections with their associated posts
        const sections = await prisma.section.findMany({
            where: { classroomId }
        });

        return new Response(
            JSON.stringify(sections),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error fetching sections:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch sections." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
