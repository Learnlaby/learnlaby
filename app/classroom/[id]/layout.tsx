"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useClassroomRole } from "@/hooks/useClassroomRole";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ClassroomNavbar from "@/components/ClassroomNavbar";
import Layout from "@/components/layout";

export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { role, loading } = useClassroomRole(id as string);

  const restrictedTeacherPaths = ["/grade", "/analytics"];

  useEffect(() => {
    if (
      !loading &&
      restrictedTeacherPaths.some((p) => pathname.endsWith(p)) &&
      !["teacher", "co-teacher"].includes(role)
    ) {
      router.replace(`/classroom/not-authorized`);
    }
  }, [pathname, role, loading, id, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking access...
      </div>
    );
  }

  if (role === "none") return null;

  return (
    <Layout>
      <ClassroomNavbar />
      {children}
    </Layout>
  );
}
