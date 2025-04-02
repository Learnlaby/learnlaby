"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { useParams } from "next/navigation"

export default function GradePage() {
  const { id: classroomId } = useParams()
  const [assignments, setAssignments] = React.useState<any[]>([])
  const [students, setStudents] = React.useState<any[]>([])
  const [scores, setScores] = React.useState<{ [assignmentId: string]: { [studentId: string]: number | null } }>({})
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")

  React.useEffect(() => {
    if (!classroomId) return

    const fetchData = async () => {
      const res = await fetch("/api/classroom/posts/assignment/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId }),
      })

      if (res.ok) {
        const data = await res.json()
        const assignmentList = data.assignments || []
        const memberList = data.students || []

        const scoreMap: { [assignmentId: string]: { [studentId: string]: number | null } } = {}

        assignmentList.forEach((assignment: any) => {
          const assignmentId = assignment.id
          scoreMap[assignmentId] = {}

          memberList.forEach((student: any) => {
            const studentId = student.id
            const submission = assignment.submissions.find(
              (s: any) => s.studentId === studentId
            )

            if (submission) {
              if (submission.grade) {
                scoreMap[assignmentId][studentId] = submission.grade.score
              } else {
                scoreMap[assignmentId][studentId] = -1 // Turned in but not graded
              }
            } else {
              scoreMap[assignmentId][studentId] = null // Not submitted
            }
          })
        })

        const formattedMembers = memberList.map((m: any) => ({
          id: m.id,
          name: m.name || "Unnamed",
          avatar: m.image || "/placeholder.svg",
        }))

        setAssignments(assignmentList)
        setStudents(formattedMembers)
        setScores(scoreMap)
        console.log(scoreMap)
      }
    }

    fetchData()
  }, [classroomId])

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const sortedStudents = React.useMemo(() => {
    return [...students].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name)
      }
      return b.name.localeCompare(a.name)
    })
  }, [students, sortOrder])

  const calculateClassAverage = (assignmentId: string, maxScore?: number) => {
    const studentScores = scores[assignmentId]
  
    if (!maxScore) return "-" // Ungraded assignment
  
    if (!studentScores) return "0.0" // No submissions at all
  
    const validScores = Object.values(studentScores).filter(
      (score) => score !== null && score !== -1
    ) as number[]
  
    if (validScores.length === 0) return "0.0" // Graded assignment but no valid scores
  
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length
    return average.toFixed(1)
  }
   
  

  return (
    <div className="container mx-auto py-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 data-[state=open]:bg-accent">
                      <span>Sort by first name</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleSort}>
                      Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              {assignments.map((assignment) => (
                <TableHead key={assignment.id} className="text-center">
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-muted-foreground text-sm">
                    {assignment.maxScore ? `Out of ${assignment.maxScore}` : "Ungraded"}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium">Class Average</TableCell>
              {assignments.map((assignment) => (
                <TableCell key={assignment.id} className="text-center">
                  {calculateClassAverage(assignment.id, assignment.maxScore)}
                </TableCell>
              ))}
            </TableRow>
            {sortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {student.name}
                  </div>
                </TableCell>
                {assignments.map((assignment) => (
                  <TableCell key={assignment.id} className="text-center">
                    {(() => {
                      const score = scores[assignment.id]?.[student.id];

                      if (!assignment.maxScore) {
                        return score !== null && score !== undefined ? "Submitted" : "Not submitted";
                      }

                      if (score === null || score === undefined) {
                        return "Not submitted";
                      }

                      if (score === -1) {
                        return `Turned in`;
                      }

                      return `${score} / ${assignment.maxScore}`;
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
