"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical, FileText, SquareUserRound } from "lucide-react";
import { format } from "date-fns";


export default function Classwork() {
  const [assignments, setAssignments] = useState<{ id: string; title: string; content: string; fileUrl?: string; dueDate?: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const classroomId = params?.id as string;

  useEffect(() => {
    async function fetchClasswork() {
      if (!classroomId) {
        setError("Classroom ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/classroom/posts/assignment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classwork assignments.");
        }

        const data = await response.json();
        setAssignments(data.assignments);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchClasswork();
  }, [classroomId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading classwork...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-10">
      <a href="#" className="text-purple-600 flex items-center mb-10">
        <SquareUserRound className="w-6 h-6 mr-2 text-purple-600" />
        View your work
      </a>

      <div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
          <h2 className="text-lg font-semibold">All Assignments</h2>
          <MoreVertical className="text-gray-500 cursor-pointer" />
        </div>

        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="my-2 mt-transparent shadow-none border-none">
              <CardHeader className="flex flex-row items-center space-x-3 p-2">
                <FileText className="text-gray-500" />
                <CardTitle className="text-base font-normal flex items-center justify-between w-full">
                  <a href={assignment.fileUrl || "#"} className="text-gray-600">
                    {assignment.title}
                  </a>
                  {assignment.dueDate && (
                    <span className="text-sm text-muted-foreground ml-2">
                      {`Due ${format(new Date(assignment.dueDate), "d MMM HH:mm")}`}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No assignments posted yet.</p>
        )}
      </div>
    </div>
  );
}
