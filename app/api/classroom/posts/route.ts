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
        const { classroomId } = JSON.parse(bodyText);

        if (!classroomId) {
            return new Response(
                JSON.stringify({ error: "Classroom ID is required" }),
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

        // Fetch posts for the given classroom and include the sender's name
        const posts = await prisma.post.findMany({
            where: { classroomId },
            orderBy: { createdAt: "desc" }, // Sort by latest posts
            include: {
                author: { select: { name: true } } // Include the sender's name
            }
        });

        return new Response(
            JSON.stringify(posts),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error fetching classroom posts:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch classroom posts" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
