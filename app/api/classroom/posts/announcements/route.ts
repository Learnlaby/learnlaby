import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // Get the authenticated user's session
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
        const bodyText = await request.text();
        const { classroomId, content } = JSON.parse(bodyText);

        // Validate required fields
        if (!classroomId || !content) {
            return new Response(
                JSON.stringify({ error: "Classroom ID, and content are required" }),
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

        // Create the post
        const post = await prisma.post.create({
            data: {
                classroomId,
                userId: user.id,
                type: "announcement", 
                content
            }
        });

        return new Response(
            JSON.stringify(post),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error creating post:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create post" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
