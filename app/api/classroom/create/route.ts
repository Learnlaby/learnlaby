import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const bodyText = await request.text();
        const { 
            name, 
            description = "", 
            image = "", 
            ownerId = "cm71r6gx20000gplodcp6yxtc" 
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
