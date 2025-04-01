import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const prisma = new PrismaClient();
const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const formData = await request.formData();
  const postId = formData.get("postId") as string;
  const files = formData.getAll("files") as File[];

  const submission = await prisma.submission.create({
    data: {
      postId,
      studentId: user.id,
    },
  });

  const uploadedFiles = [];
  for (const file of files) {
    const key = `${Date.now()}-${file.name}`;
    const putCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
      Key: key,
      ContentType: file.type,
    });

    const signedUrl = await getSignedUrl(s3, putCommand, { expiresIn: 3600 });

    const res = await fetch(signedUrl, {
      method: "PUT",
      body: await file.arrayBuffer(),
      headers: { "Content-Type": file.type },
    });

    if (!res.ok) continue;

    const url = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${key}`;
    const saved = await prisma.file.create({
      data: { submissionId: submission.id, url },
    });
    uploadedFiles.push(saved);
  }

  return Response.json({ submission, files: uploadedFiles });
}