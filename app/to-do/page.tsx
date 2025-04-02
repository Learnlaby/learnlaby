"use client";
import * as React from "react";
import Layout from "@/components/layout";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string | null;
  className: string;
  dueDate: string | null;
  classroomId: string;
  status: "assigned" | "missing" | "done";
}

interface AssignmentGroup {
  title: string;
  count: number;
  assignments: Assignment[];
  colorClass: string;
  colorCount: string;
}

export default function WorkPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await fetch("/api/classroom/todo");
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch assignments.");
          return;
        }
        const data = await response.json();
        setAssignments(
          data.assignments.map((assignment: any) => ({
            id: assignment.id,
            title: assignment.title,
            className: assignment.classroomName,
            dueDate: assignment.dueDate,
            classroomId: assignment.classroomId,
            status: assignment.status,
          }))
        );
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 space-y-4 p-4 md:p-8">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex-1 space-y-4 p-4 md:p-8">Error: {error}</div>
      </Layout>
    );
  }

  const getWeekRange = (date: Date): { start: Date; end: Date } => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));
    return { start: startOfWeek, end: endOfWeek };
  };

  const today = new Date();
  const { start: startOfThisWeek, end: endOfThisWeek } = getWeekRange(today);
  const { start: startOfNextWeek, end: endOfNextWeek } = getWeekRange(
    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  );

  const assignmentGroups: Record<string, AssignmentGroup> = {
    done: { title: "Done", count: 0, assignments: [], colorClass: "bg-green-500", colorCount: "bg-green-100" },
    missing: { title: "Missing", count: 0, assignments: [], colorClass: "bg-red-500", colorCount: "bg-red-100" },
    thisWeek: { title: "This week", count: 0, assignments: [], colorClass: "bg-orange-500", colorCount: "bg-orange-100" },
    nextWeek: { title: "Next week", count: 0, assignments: [], colorClass: "bg-yellow-500", colorCount: "bg-yellow-100" },
    later: { title: "Later", count: 0, assignments: [], colorClass: "bg-blue-500", colorCount: "bg-blue-100" },
  };

  assignments.forEach((assignment) => {
    if (assignment.status === "done") { // Assuming done status is set when the assignment is completed
      assignmentGroups.done.assignments.push(assignment);
      assignmentGroups.done.count++;
    } else {
      if (assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate >= startOfThisWeek && dueDate <= endOfThisWeek) {
          assignmentGroups.thisWeek.assignments.push(assignment);
          assignmentGroups.thisWeek.count++;
        } else if (dueDate >= startOfNextWeek && dueDate <= endOfNextWeek) {
          assignmentGroups.nextWeek.assignments.push(assignment);
          assignmentGroups.nextWeek.count++;
        } else if (dueDate > endOfNextWeek) {
          assignmentGroups.later.assignments.push(assignment);
          assignmentGroups.later.count++;
        } else if (dueDate < startOfThisWeek) { // have to check the status of the assignment (missing or done)
          assignmentGroups.missing.assignments.push(assignment);
          assignmentGroups.missing.count++;
        }
      }
    }
  });

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {Object.entries(assignmentGroups).map(([key, group]) => (
            <div key={key} className="border rounded-3xl p-4 shadow-sm bg-gray-50 flex flex-col lg:h-screen h-auto">
              <div className="flex justify-between items-center pb-2">
                <div className="flex items-center">
                  <div className={cn("w-3 h-3 rounded-full mr-2 mb-2", group.colorClass)}></div>
                  <h3 className="text-lg font-medium">{group.title}</h3>
                </div>
                <span className={cn("px-2 py-1 text-xs border rounded-full", group.colorCount)}>{group.count}</span>
              </div>
              <div className="space-y-1 flex-grow overflow-y-auto">
                {group.assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border rounded-3xl bg-white">
                    <h4 className="text-sm font-medium mb-1">{assignment.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{assignment.className}</span>
                      {assignment.dueDate && (
                        <span className={key === "thisWeek" ? "text-red-600 ml-10" : "ml-10"}>
                          {new Date(assignment.dueDate).toLocaleDateString()} {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
