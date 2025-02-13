import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const classrooms = await prisma.classroom.findMany();
        return Response.json(classrooms);
    } catch (error) {
        console.error("Error fetching classrooms:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch classrooms" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
