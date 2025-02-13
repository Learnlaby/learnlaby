"use client";

import React from 'react'
import { useParams } from 'next/navigation';  // Use useParams for dynamic route params in Next.js 13+
import {
  ClipboardList,
  BarChart3,
  BookOpen,
  Users,
  BadgeIcon as GradeIcon,
} from "lucide-react"
import Link from "next/link"

const ClassroomNavbar = () => {
  const { id } = useParams();  // Extract dynamic route param `id`

  if (!id) return null;  // If the `id` is not available, render nothing (or a loading spinner)

  return (
    <div className="border-b w-full" style={{ width: "100%" }}>
      <nav className="flex w-full items-center gap-6 px-6 py-4">
        <Link href={`/classroom/${id}/stream`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <BookOpen className="w-4 h-4" />
          <span>Stream</span>
        </Link>
        <Link href={`/classroom/${id}/classwork`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ClipboardList className="w-4 h-4" />
          <span>Classwork</span>
        </Link>
        <Link href={`/classroom/${id}/member`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <Users className="w-4 h-4" />
          <span>People</span>
        </Link>
        <Link href={`/classroom/${id}/grade`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <GradeIcon className="w-4 h-4" />
          <span>Grade</span>
        </Link>
        <Link href={`/classroom/${id}/analytics`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </Link>
      </nav>
    </div>
  )
}

export default ClassroomNavbar
