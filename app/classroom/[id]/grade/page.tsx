"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// Sample data structure
const assignments = [
  { id: "A", name: "Assignment A", maxScore: 100 },
  { id: "B", name: "Assignment B", maxScore: 100 },
  { id: "C", name: "Assignment C", maxScore: 100 },
  { id: "D", name: "Assignment D", maxScore: 100 },
  { id: "E", name: "Assignment E", maxScore: 100 },
]

const students = [
  { id: 1, name: "Lorem Ipsum A", avatar: "/placeholder.svg" },
  { id: 2, name: "Lorem Ipsum B", avatar: "/placeholder.svg" },
  { id: 3, name: "Lorem Ipsum C", avatar: "/placeholder.svg" },
  { id: 4, name: "Lorem Ipsum D", avatar: "/placeholder.svg" },
  { id: 5, name: "Lorem Ipsum E", avatar: "/placeholder.svg" },
  { id: 6, name: "Lorem Ipsum F", avatar: "/placeholder.svg" },
  { id: 7, name: "Lorem Ipsum G", avatar: "/placeholder.svg" },
  { id: 8, name: "Lorem Ipsum H", avatar: "/placeholder.svg" },
]

// Generate random scores for demo
const generateScores = () => {
  const scores: { [key: string]: { [key: string]: number } } = {}
  students.forEach((student) => {
    scores[student.id] = {}
    assignments.forEach((assignment) => {
      scores[student.id][assignment.id] = -1 // -1 represents ungraded
    })
  })
  return scores
}

export default function GradePage() {
  const [scores, setScores] = React.useState(generateScores())
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc")

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
  }, [sortOrder])

  const calculateClassAverage = (assignmentId: string) => {
    const validScores = Object.values(scores)
      .map((studentScores) => studentScores[assignmentId])
      .filter((score) => score !== -1)

    if (validScores.length === 0) return "-"

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
                  <div className="font-medium">{assignment.name}</div>
                  <div className="text-muted-foreground text-sm">Out of {assignment.maxScore}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium">Class Average</TableCell>
              {assignments.map((assignment) => (
                <TableCell key={assignment.id} className="text-center">
                  {calculateClassAverage(assignment.id)}
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
                    {scores[student.id][assignment.id] === -1
                      ? "__ / 100"
                      : `${scores[student.id][assignment.id]} / 100`}
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

