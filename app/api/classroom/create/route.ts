import { PrismaClient } from "@prisma/client";
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../../auth/[...nextauth]/route";


const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    
    try {
        const bodyText = await request.text();
        const { 
            name, 
            description = "", 
            image = "", 
            ownerId = session && session.user ? (session.user as { id: string }).id : null 
        } = JSON.parse(bodyText);

        if (!name) {
            return new Response(
                JSON.stringify({ error: "Classroom name is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const classroom = await prisma.classroom.create({
            data: {
                name,
                description,
                image,
                ownerId
            },
        });

        await prisma.classroomMember.create({
            data: {
                classroomId: classroom.id,
                userId: ownerId,
                role: "teacher",
            },
        });

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
