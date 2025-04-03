"use client";

import { useEffect, useState } from "react";
import { Files } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function ReviewWork() {
  const { id, assignmentId } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [assignment, setAssignment] = useState("Assignment");
  const [sortOption, setSortOption] = useState("status");
  const [mainFilter, setMainFilter] = useState("All");

  const submissionAPI = "/api/classroom/submission";
  const avatarImage = "https://placekitten.com/100/100";
  const fileAPI = "/classroom/[id]/classwork/review/[assignmentId]/[studentId]";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(submissionAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: assignmentId }),
        });

        const data = await response.json();
        const submissions = data.assignment.submissions || [];

        const mappedStudents = data.students.map((student: any) => {
          const submission = submissions.find((s: any) => s.studentId === student.id);

          const fullName = student.name || "Unknown";
          const image = student.image || "U";
          let status = "Not submitted";
          let docId = "";
          let score: number | null = null;

          if (submission) {
            docId = submission.id;
            if (submission.grade) {
              status = "Graded";
              score = submission.grade.score;
            } else {
              status = "Turned in";
            }
          }

          return {
            id: student.id,
            name: fullName,
            fullName,
            status,
            image,
            docId,
            score,
          };
        });

        setStudents(mappedStudents);
        setAssignment(data.assignment.title);
      } catch (err) {
        console.error("Failed to fetch assignment data:", err);
      }
    };

    fetchData();
  }, [assignmentId]);

  const filteredStudents = mainFilter === "All" ? students : students.filter(s => s.status === mainFilter);

  const sortStudents = (students: any[]) => {
    if (sortOption === "status") {
      return [...students].sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortOption === "firstName") {
      return [...students].sort((a, b) => {
        const aFirst = a.fullName.split(" ")[0];
        const bFirst = b.fullName.split(" ")[0];
        return aFirst.localeCompare(bFirst);
      });
    } else if (sortOption === "lastName") {
      return [...students].sort((a, b) => {
        const aLast = a.fullName.split(" ")[1] || "";
        const bLast = b.fullName.split(" ")[1] || "";
        return aLast.localeCompare(bLast);
      });
    }
    return students;
  };

  const sortedStudents = sortStudents(filteredStudents);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white overflow-y-auto p-4">
          <select
            className="text-sm w-full mb-4 border rounded px-3 py-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="status">Sort by status</option>
            <option value="firstName">Sort by first name</option>
            <option value="lastName">Sort by last name</option>
          </select>

          {["Graded", "Turned in", "Not submitted"].map((status) => (
            <div key={status} className="mb-4">
              <h3 className="text-sm font-medium px-2 py-1">{status}</h3>
              <Separator />
              {sortedStudents
                .filter((s) => s.status === status)
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 border-b hover:bg-gray-100">
                    <div className="flex items-center">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.image || avatarImage} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2 text-sm">{student.name}</div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {student.status === "Graded"
                        ? `${student.score ?? "?"}/100`
                        : "___/100"}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-10 overflow-auto">
          <h1 className="text-3xl font-semibold">{assignment}</h1>

          <div className="flex mt-4 mb-6 gap-12">
            <div>
              <div className="text-4xl font-medium">{students.filter(s => s.status !== "Not submitted").length}</div>
              <div className="text-sm text-gray-500">Turned in</div>
            </div>
            <div>
              <div className="text-4xl font-medium">{students.filter(s => s.status === "Not submitted").length}</div>
              <div className="text-sm text-gray-500">Not submitted</div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <select
              className="text-sm px-3 py-2 border rounded"
              value={mainFilter}
              onChange={(e) => setMainFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Turned in">Turned in</option>
              <option value="Graded">Graded</option>
              <option value="Not submitted">Not submitted</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedStudents
              .filter((student) => student.status !== "Not submitted")
              .map((student) => (
                <Link
                  key={student.id}
                  href={`${fileAPI}/${student.id}?name=${encodeURIComponent(student.name)}&status=${student.status}&docId=${student.docId}`}
                  className="bg-white rounded shadow block"
                >
                  <div className="p-3 border-b flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: student.avatarColor }}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.image || avatarImage} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{student.fullName}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="h-32 bg-gray-100 flex items-center justify-center mb-2">
                      <Files className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="flex justify-end">
                      <div className={`text-xs ${student.status === "Graded" ? "text-green-600" :
                        student.status === "Turned in" ? "text-purple-600" :
                          "text-gray-600"
                        }`}>
                        {student.status}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
