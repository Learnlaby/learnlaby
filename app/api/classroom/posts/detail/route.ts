import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { postId } = await request.json();
        if (!postId) {
            return new Response(
                JSON.stringify({ error: "Post ID is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch the post with author & files
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                author: { select: { name: true } },
                // files: { select: { id: true, fileUrl: true } },
            }
        });

        if (!post) {
            return new Response(
                JSON.stringify({ error: "Post not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify(post),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching post details:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch post details." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
