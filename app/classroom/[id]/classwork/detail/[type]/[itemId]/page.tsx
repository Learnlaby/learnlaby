"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, NotebookText, NotebookPen } from "lucide-react";

export default function ClassworkDetailPage() {
  const { type } = useParams();

  // Mocked classwork data
  const isAssignment = type === "assignment";

  const classwork = isAssignment
    ? {
        id: "mock-assignment-001",
        title: "Math Homework #3",
        content: "Solve the following 5 math problems and submit before the due date.",
        dueDate: "2025-03-20",
        createdAt: "2025-03-15",
        type: "assignment",
        author: { name: "Prof. John Doe" },
        points: 100,
      }
    : {
        id: "mock-material-001",
        title: "Physics Lecture Notes",
        content: "Here are the lecture notes for this week's physics class.",
        fileUrl: "https://example.com/lecture-notes.pdf",
        createdAt: "2025-03-15",
        type: "material",
        author: { name: "Dr. Jane Smith" },
      };

      return (
        <div className="p-10 max-w-5xl mx-auto flex gap-6">
          {/* Left Side - Main Content */}
          <div className="flex-1">
            {/* Title & Author */}
            <h1 className="text-2xl font-bold">{classwork.title}</h1>
            <p className="text-gray-700 mt-2">
              {classwork.author.name} • {new Date(classwork.createdAt).toLocaleDateString()}
            </p>
    
            {/* Content */}
            <p className="text-gray-800 mt-4">{classwork.content}</p>
    
            {/* Assignment-specific details */}
            {isAssignment && (
              <>
                <p className="text-gray-600 mt-2">Due Date: {classwork.dueDate}</p>
                <p className="text-gray-600">Points: {classwork.points}</p>
              </>
            )}
    
            {/* Material-specific details */}
            {!isAssignment && classwork.fileUrl && (
              <a href={classwork.fileUrl} target="_blank" className="mt-4 text-blue-600 underline">
                View Attached File
              </a>
            )}
    
            {/* Class Comments */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
              <p className="font-semibold">Class comments</p>
              <input
                type="text"
                className="mt-2 p-2 w-full border rounded-md"
                placeholder="Add a class comment..."
              />
            </div>
          </div>
    
          {/* Right Side - "Your Work" Section */}
          {isAssignment && (
            <div className="w-72 p-4 border rounded-lg shadow-lg">
              <p className="font-bold text-gray-800">Your work <span className="ml-20 font-normal text-green-600">Assigned</span></p>
              
              <Button className="mt-4 w-full bg-gray-400 text-white rounded-md flex items-center justify-center">
                <Plus className="w-4 h-4 mr-2" /> Add or create
              </Button>
    
              <Button className="mt-2 w-full bg-purple-600 text-white rounded-md flex items-center justify-center">
                <Plus className="w-4 h-4 mr-2" /> Mark as done
              </Button>
            </div>
          )}
        </div>
      );
    }