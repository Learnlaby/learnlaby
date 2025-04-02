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

        // Parse the request body
        const bodyText = await request.text();
        const { postId, content } = JSON.parse(bodyText);

        // Validate required fields
        if (!postId || !content || content.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Post ID and content are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is a member of the classroom where the post belongs
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { classroom: true }
        });

        if (!post) {
            return new Response(
                JSON.stringify({ error: "Post not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is a member of the classroom
        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId: post.classroomId }
        });

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member" }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create the comment
        const comment = await prisma.comment.create({
            data: {
              postId,
              userId: user.id,
              content
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          });

        return new Response(
            JSON.stringify(comment),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create comment" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Get the URL and extract the postId parameter
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return new Response(
                JSON.stringify({ error: "Post ID is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Get comments for the specified post
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return new Response(
            JSON.stringify(comments),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error fetching comments:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch comments" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
