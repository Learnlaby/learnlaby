"use client"
import * as React from "react";
import { cn } from "@/lib/utils";

interface Assignment {
  id: number;
  title: string;
  className: string;
  dueDate?: string;
}

interface AssignmentGroup {
  title: string;
  count: number;
  assignments: Assignment[];
}

const assignmentGroups: Record<string, AssignmentGroup> = {
  noDueDate: {
    title: "No due date",
    count: 2,
    assignments: [
      { id: 1, title: "Assignment 1", className: "Class A" },
      { id: 2, title: "Assignment 2", className: "Class B" },
    ],
  },
  thisWeek: {
    title: "This week",
    count: 3,
    assignments: [
      { id: 3, title: "Assignment 1", className: "Class C", dueDate: "xxday, xx 26" },
      { id: 4, title: "Assignment 2", className: "Class C", dueDate: "xxday, xx 26" },
      { id: 5, title: "Assignment 2", className: "Class D", dueDate: "xxday, xx 26" },
    ],
  },
  nextWeek: {
    title: "Next week",
    count: 1,
    assignments: [{ id: 6, title: "Assignment 2", className: "Class A", dueDate: "xxday, xx 26" }],
  },
  later: {
    title: "Later",
    count: 1,
    assignments: [{ id: 7, title: "Assignment 2", className: "Class A", dueDate: "xxday, xx 26" }],
  },
};

export default function WorkPage() {
  const [activeTab, setActiveTab] = React.useState("assigned");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex space-x-4 border-b">
        {["assigned", "missing", "done"].map((tab) => (
          <button
            key={tab}
            className={cn(
              "px-4 py-2 border-b-2",
              activeTab === tab ? "border-blue-500" : "border-transparent"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === "assigned" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(assignmentGroups).map(([key, group]) => (
            <div key={key} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-sm font-medium">{group.title}</h3>
                <span className="px-2 py-1 text-xs border rounded-full">{group.count}</span>
              </div>
              <div className="space-y-2">
                {group.assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium mb-1">{assignment.title}</h4>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{assignment.className}</span>
                      {assignment.dueDate && (
                        <span className={key === "thisWeek" ? "text-red-500" : ""}>{assignment.dueDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "missing" && (
        <div className="flex h-[450px] items-center justify-center text-gray-500">No missing assignments</div>
      )}
      {activeTab === "done" && (
        <div className="flex h-[450px] items-center justify-center text-gray-500">No completed assignments</div>
      )}
    </div>
  );
}
