"use client"

import { useParams, usePathname } from "next/navigation"
import { ClipboardList, BarChart3, BookOpen, Users, BadgeIcon as GradeIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  CLASSROOM_STREAM_PAGE,
  CLASSROOM_CLASSWORK_PAGE,
  CLASSROOM_MEMBER_PAGE,
  CLASSROOM_GRADE_PAGE,
  CLASSROOM_ANALYTICS_PAGE,
  CLASSROOM_MEMBER_API
} from "@/lib/api_routes"
import RoleBased from "@/app/components/RoleBased"

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

  // Helper function to replace [id] with actual classroom ID
  const getRoute = (route: string) => route.replace("[id]", id as string)

  useEffect(() => {
    async function fetchUserRole() {
      if (!id || !session?.user?.email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(CLASSROOM_MEMBER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId: id }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch classroom members.")
        }

        const data = await response.json()
        const members: ClassroomMember[] = data.members

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

  if (!id) return null
  if (loading) return <div className="border-b w-full py-4 px-6">Loading classroom navigation...</div>

  const isActive = (link: string) => pathname === link ? "text-purple-600 font-semibold" : "text-muted-foreground"

  return (
    <div className="border-b w-full">
      <nav className="flex w-full items-center gap-6 px-6 py-4">
        <Link
          href={getRoute(CLASSROOM_STREAM_PAGE)}
          className={`flex items-center gap-2 ${isActive(getRoute(CLASSROOM_STREAM_PAGE))}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Stream</span>
        </Link>
        <Link
          href={getRoute(CLASSROOM_CLASSWORK_PAGE)}
          className={`flex items-center gap-2 ${isActive(getRoute(CLASSROOM_CLASSWORK_PAGE))}`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Classwork</span>
        </Link>
        <Link
          href={getRoute(CLASSROOM_MEMBER_PAGE)}
          className={`flex items-center gap-2 ${isActive(getRoute(CLASSROOM_MEMBER_PAGE))}`}
        >
          <Users className="w-4 h-4" />
          <span>People</span>
        </Link>

        <RoleBased allowedRoles={["teacher", "co-teacher"]} userRole={userRole}>
          <Link
            href={getRoute(CLASSROOM_GRADE_PAGE)}
            className={`flex items-center gap-2 ${isActive(getRoute(CLASSROOM_GRADE_PAGE))}`}
          >
            <GradeIcon className="w-4 h-4" />
            <span>Grade</span>
          </Link>
          <Link
            href={getRoute(CLASSROOM_ANALYTICS_PAGE)}
            className={`flex items-center gap-2 ${isActive(getRoute(CLASSROOM_ANALYTICS_PAGE))}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
        </RoleBased>
      </nav>
    </div>
  )
}

export default ClassroomNavbar
