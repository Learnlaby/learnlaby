"use client";

import { useParams } from "next/navigation";

export default function ClassroomPage() {
  const { classroomId } = useParams();

  return <h1>Page {classroomId}</h1>;
}
