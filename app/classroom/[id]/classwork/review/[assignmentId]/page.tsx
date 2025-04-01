"use client";

import { useEffect, useState } from "react";
import { Files } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReviewWork() {
  const { id, assignmentId } = useParams();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState("status");
  const [mainFilter, setMainFilter] = useState("All");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/classroom/submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: assignmentId }),
        });
        const data = await response.json();
        const mapped = data.map((submission: any) => {
          const name = submission.student?.name || "Unknown";
          return {
            id: submission.studentId,
            name,
            fullName: name,
            status: submission.grade ? "Graded" : "Turned in",
            avatar: name[0]?.toUpperCase() || "U",
            avatarColor: "#"+((Math.random()*0xFFFFFF<<0).toString(16)).padStart(6, "0"), // random pastel color
            docId: submission.id,
          };
        });
        setSubmissions(mapped);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const filtered = mainFilter === "All" ? submissions : submissions.filter(s => s.status === mainFilter);

  const sortStudents = (students: any[]) => {
    if (sortOption === "status") {
      return [...students].sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortOption === "firstName") {
      return [...students].sort((a, b) => a.fullName.split(" ")[0].localeCompare(b.fullName.split(" ")[0]));
    } else if (sortOption === "lastName") {
      return [...students].sort((a, b) => (a.fullName.split(" ")[1] || "").localeCompare(b.fullName.split(" ")[1] || ""));
    }
    return students;
  };

  const sorted = sortStudents(submissions);

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

          {["Graded", "Turned in"].map((status) => (
            <div key={status} className="mb-4">
              <h3 className="text-sm font-medium px-2 py-1">{status}</h3>
              <Separator />
              {sorted
                .filter((s) => s.status === status)
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 border-b hover:bg-gray-100">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: student.avatarColor }}
                      >
                        {student.avatar}
                      </div>
                      <div className="ml-2 text-sm">{student.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">{status === "Graded" ? "100/100" : "___/100"}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-10 overflow-auto">
          <h1 className="text-3xl font-semibold">Assignment</h1>

          <div className="flex mt-4 mb-6 gap-12">
            <div>
              <div className="text-4xl font-medium">{submissions.filter(s => s.status !== "Not submitted").length}</div>
              <div className="text-sm text-gray-500">Turned in</div>
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
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((student) => (
              <Link
                key={student.id}
                href={`/classroom/${id}/classwork/review/${assignmentId}/${student.id}?name=${encodeURIComponent(student.name)}&status=${student.status}&docId=${student.docId}`}
                className="bg-white rounded shadow block"
              >
                <div className="p-3 border-b flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: student.avatarColor }}
                  >
                    {student.avatar}
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
                    <div className={`text-xs ${
                      student.status === "Graded" ? "text-green-600" :
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
