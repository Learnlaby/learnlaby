"use client";
import { useParams } from "next/navigation";
import Layout from "@/components/layout";

export default function ClassroomPage() {
  const { classroomId } = useParams();

  return (
    <Layout>
      <h1>Classroom {classroomId}</h1>
    </Layout>
  );
}
