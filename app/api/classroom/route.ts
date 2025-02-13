import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust the import based on your project structure

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get session to find logged-in user
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Find the logged-in user's ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Get all classroom memberships for the user
        const memberships = await prisma.classroomMember.findMany({
            where: { userId: user.id },
            select: { classroomId: true }
        });

        // Extract classroom IDs
        const classroomIds = memberships.map(m => m.classroomId);

        // Fetch classrooms based on IDs
        const classrooms = await prisma.classroom.findMany({
            where: { id: { in: classroomIds } }
        });

        return Response.json(classrooms);
    } catch (error) {
        console.error("Error fetching classrooms:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
