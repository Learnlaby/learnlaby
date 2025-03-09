"use client"
import { useParams, usePathname } from "next/navigation" // Use useParams for dynamic route params in Next.js 13+
import { ClipboardList, BarChart3, BookOpen, Users, BadgeIcon as GradeIcon, UserPlus } from "lucide-react"
import Link from "next/link"

const ClassroomNavbar = () => {
  const { id } = useParams() // Extract dynamic route param `id`
  const pathname = usePathname()

  if (!id) return null // If the `id` is not available, render nothing (or a loading spinner)
  const isActive = (link: string) => (pathname === link ? "text-purple-600 font-semibold" : "text-muted-foreground") // determine if the current link is active

  return (
    <div className="border-b w-full" style={{ width: "100%" }}>
      <nav className="flex w-full items-center gap-6 px-6 py-4">
        <Link
          href={`/classroom/${id}/stream`}
          className={`flex items-center gap-2 ${isActive(`/classroom/${id}/stream`)}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Stream</span>
        </Link>
        <Link
          href={`/classroom/${id}/classwork`}
          className={`flex items-center gap-2 ${isActive(`/classroom/${id}/classwork`)}`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Classwork</span>
        </Link>
        <Link
          href={`/classroom/${id}/member`}
          className={`flex items-center gap-2 ${isActive(`/classroom/${id}/member`)}`}
        >
          <Users className="w-4 h-4" />
          <span>People</span>
        </Link>
        <Link
          href={`/classroom/${id}/grade`}
          className={`flex items-center gap-2 ${isActive(`/classroom/${id}/grade`)}`}
        >
          <GradeIcon className="w-4 h-4" />
          <span>Grade</span>
        </Link>
        <Link
          href={`/classroom/${id}/analytics`}
          className={`flex items-center gap-2 ${isActive(`/classroom/${id}/analytics`)}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </Link>
      </nav>
    </div>
  )
}

export default ClassroomNavbar

