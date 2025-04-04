import { redirect } from "next/navigation";
import { CLASSROOM_DEFAULT_REDIRECT } from "@/lib/api_routes";

export default function ClassroomPage({ params }: { params: { id: string } }) {
  redirect(CLASSROOM_DEFAULT_REDIRECT(params.id));
}