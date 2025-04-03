"use client"

import { useParams, usePathname } from "next/navigation"
import { ClipboardList, BarChart3, BookOpen, Users, BadgeIcon as GradeIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface ClassroomMember {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

const ClassroomNavbar = () => {
  const { id } = useParams() // Extract dynamic route param `id`
  const pathname = usePathname()
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const classroomStreamAPI = "/classroom/${id}/stream";
  const classroomClassworkAPI = "/classroom/${id}/classwork";
  const classroomMemberAPI = "/classroom/${id}/member";
  const classroomGradeAPI = "/classroom/${id}/grade";
  const classroomAnalyticsAPI = "/classroom/${id}/analytics";
  const memberAPI = "/api/classroom/member";

  useEffect(() => {
    async function fetchUserRole() {
      if (!id || !session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(memberAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId: id }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch classroom members.")
        }

        const data = await response.json()
        const members: ClassroomMember[] = data.members
        
        // Find the current user in the classroom members
        const currentUserEmail = session.user.email
        const currentMember = members.find(member => member.email === currentUserEmail)
        
        if (currentMember) {
          setUserRole(currentMember.role)
        } else {
          setUserRole("Not a member")
        }
      } catch (err) {
        console.error("Error fetching user role:", err)
        setUserRole("Unknown")
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [id, session])

  if (!id) return null // If the `id` is not available, render nothing
  if (loading) return <div className="border-b w-full py-4 px-6">Loading classroom navigation...</div>

  const isActive = (link: string) => (pathname === link ? "text-purple-600 font-semibold" : "text-muted-foreground")
  const isTeacher = userRole === "teacher" || userRole === "co-teacher"

  return (
    <div className="border-b w-full" style={{ width: "100%" }}>
      <nav className="flex w-full items-center gap-6 px-6 py-4">
        <Link
          href={classroomStreamAPI}
          className={`flex items-center gap-2 ${isActive(classroomStreamAPI)}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Stream</span>
        </Link>
        <Link
          href={classroomClassworkAPI}
          className={`flex items-center gap-2 ${isActive(classroomClassworkAPI)}`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Classwork</span>
        </Link>
        <Link
          href={classroomMemberAPI}
          className={`flex items-center gap-2 ${isActive(classroomMemberAPI)}`}
        >
          <Users className="w-4 h-4" />
          <span>People</span>
        </Link>
        
        {isTeacher && (
          <>
            <Link
              href={classroomGradeAPI}
              className={`flex items-center gap-2 ${isActive(classroomGradeAPI)}`}
            >
              <GradeIcon className="w-4 h-4" />
              <span>Grade</span>
            </Link>
            <Link
              href={classroomAnalyticsAPI}
              className={`flex items-center gap-2 ${isActive(classroomAnalyticsAPI)}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}

export default ClassroomNavbar
