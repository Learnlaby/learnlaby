"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PeoplePage() {
  const [members, setMembers] = useState<{ id: string; name: string; email: string; role: string; image?: string | null }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const classroomId = params?.id as string;

  useEffect(() => {
    async function fetchMembers() {
      if (!classroomId) {
        setError("Classroom ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/classroom/member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classroom members");
        }

        const data = await response.json();
        setMembers(data.members);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [classroomId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading members...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  // Separate teachers and students
  const teachers = members.filter((member) => member.role === "teacher" || member.role === "co-teacher");
  const students = members.filter((member) => member.role === "student");

  return (
    <div className="flex h-screen bg-background p-6">
      {/* People List */}
      <div className="w-full mx-auto space-y-6">
        {/* Teacher Section (Always visible) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Teachers</h2>
          {teachers.length > 0 ? (
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                  <Avatar>
                    <AvatarImage src={teacher.image || "https://placekitten.com/100/100"} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{teacher.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {teacher.role === "co-teacher" ? "Co-Teacher" : "Teacher"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No teachers in this classroom.</p>
          )}
        </div>

        {/* Students Section (Always visible) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Students</h2>
            <span className="text-sm text-muted-foreground">{students.length} Students</span>
          </div>
          {students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                  <Avatar>
                    <AvatarImage src={student.image || "https://placekitten.com/100/100"} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{student.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No students in this classroom.</p>
          )}
        </div>
      </div>
    </div>
  );
}
