import React from 'react'
import {
    Home,
    Calendar,
    ClipboardList,
    GraduationCap,
    BarChart3,
    BookOpen,
    Users,
    BadgeIcon as GradeIcon,
  } from "lucide-react"
  import Link from "next/link"

const ClassroomNavbar = () => {
  return (
    <div>{/* Top Navigation */}
    <div className="border-b">
    <nav className="flex items-center gap-6 px-6">
      <Link href="#" className="flex items-center gap-2 py-4 text-muted-foreground hover:text-foreground">
        <BookOpen className="w-4 h-4" />
        <span>Stream</span>
      </Link>
      <Link href="#" className="flex items-center gap-2 py-4 text-muted-foreground hover:text-foreground">
        <ClipboardList className="w-4 h-4" />
        <span>Classwork</span>
      </Link>
      <Link href="#" className="flex items-center gap-2 py-4 border-b-2 border-primary text-primary">
        <Users className="w-4 h-4" />
        <span>People</span>
      </Link>
      <Link href="#" className="flex items-center gap-2 py-4 text-muted-foreground hover:text-foreground">
        <GradeIcon className="w-4 h-4" />
        <span>Grade</span>
      </Link>
      <Link href="#" className="flex items-center gap-2 py-4 text-muted-foreground hover:text-foreground">
        <BarChart3 className="w-4 h-4" />
        <span>Analytics</span>
      </Link>
    </nav>
    </div></div>
  )
}

export default ClassroomNavbar


