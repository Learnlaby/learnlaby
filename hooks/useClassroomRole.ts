import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CLASSROOM_MEMBER_API } from "@/lib/api_routes";

export function useClassroomRole(classroomId: string) {
  const { data: session } = useSession();
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRole() {
      if (!classroomId || !session?.user?.email) return;

      try {
        const res = await fetch(CLASSROOM_MEMBER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });
        const data = await res.json();
        const member = data.members.find(
          (m: any) => m.email === session.user.email
        );
        setRole(member?.role || "none");
      } catch (err) {
        setRole("unknown");
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [classroomId, session]);

  return { role, loading };
}
