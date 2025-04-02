import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET a specific classroom by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // Extract classroom ID from URL

    try {
        const classroom = await prisma.classroom.findUnique({
            where: { id },
        });

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
        }

        return NextResponse.json(classroom);
    } catch (error) {
        console.error("Error fetching classroom:", error);
        return NextResponse.json({ error: "Failed to fetch classroom" }, { status: 500 });
    }
}
