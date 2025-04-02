import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const prisma = new PrismaClient();

// AWS S3 Client Configuration
const s3Client = new S3Client({
    region: process.env.NEXT_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response(
                JSON.stringify({ error: "Unauthorized. Please log in first." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const formData = await request.formData();
        const classroomId = formData.get("classroomId") as string;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null;
        const maxScore = formData.get("maxScore") ? parseInt(formData.get("maxScore") as string, 10) : null;
        const fileList = formData.getAll("files") as File[];
        const sectionId = formData.get("topicId") as string; // Section ID

        if (!classroomId || !title) {
            return new Response(
                JSON.stringify({ error: "Classroom ID and title are required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const isMember = await prisma.classroomMember.findFirst({
            where: { userId: user.id, classroomId }
        });

        if (!isMember) {
            return new Response(
                JSON.stringify({ error: "Forbidden: Not a classroom member." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // **Create Assignment Post**
        const assignment = await prisma.post.create({
            data: {
                classroomId,
                userId: user.id,
                type: "assignment",
                title,
                content,
                dueDate,
                sectionId,
                maxScore,
            }
        });

        const uploadedFiles = [];

        for (const file of fileList) {
            const fileKey = `${Date.now()}-${file.name}`;
            const uploadParams = {
                Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
                Key: fileKey,
                ContentType: file.type,
            };

            const command = new PutObjectCommand(uploadParams);
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            // Upload file to S3
            const response = await fetch(signedUrl, {
                method: "PUT",
                body: await file.arrayBuffer(),
                headers: {
                    "Content-Type": file.type
                }
            });

            if (!response.ok) {
                console.error(`Failed to upload file: ${file.name}`);
                continue;
            }

            const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileKey}`;

            const savedFile = await prisma.file.create({
                data: {
                    url: fileUrl,
                    postId: assignment.id,
                    name: file.name,
                },
            });

            uploadedFiles.push(savedFile);
        }

        return new Response(
            JSON.stringify({ assignment, files: uploadedFiles }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error creating assignment:", error);
        return new Response(
            JSON.stringify({ error: "Failed to create assignment." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
