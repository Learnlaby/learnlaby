import { redirect } from "next/navigation";

export default function ClassroomPage({ params }: { params: { id: string } }) {
  redirect(`/classroom/${params.id}/stream`);
}
