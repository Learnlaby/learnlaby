import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    try {
        const body = await request.json();

        const {
            name,
            description = "",
            image = "",
            startDate,
            endDate,
            timeSlots = []
        } = body;

        const ownerId = session?.user ? (session.user as { id: string }).id : null;

        if (!name || !startDate || !endDate || timeSlots.length === 0) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: name, startDate, endDate, or timeSlots." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const classroom = await prisma.classroom.create({
            data: {
                name,
                description,
                image,
                ownerId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });

        await prisma.classroomMember.create({
            data: {
                classroomId: classroom.id,
                userId: ownerId!,
                role: "teacher",
            },
        });

        for (const slot of timeSlots) {
            await prisma.timeSlot.create({
                data: {
                    classroomId: classroom.id,
                    day: slot.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                },
            });
        }

        return new Response(JSON.stringify(classroom), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error creating classroom:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create classroom" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
