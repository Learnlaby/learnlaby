"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, NotebookText, NotebookPen } from "lucide-react";

export default function ClassworkDetailPage() {
  const { postId, classroomId } = useParams(); // Get classroom and post IDs
  const [classwork, setClasswork] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClassworkDetails() {
      if (!postId) return;

      try {
        const response = await fetch(`/api/classroom/posts/detail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        console.log("first")

        if (!response.ok) {
          throw new Error("Failed to fetch classwork details.");
        }

        const data = await response.json();
        console.log(data)
        setClasswork(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchClassworkDetails();
  }, [postId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading classwork details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!classwork) {
    return <div className="flex justify-center items-center h-screen">No classwork found.</div>;
  }

  const isAssignment = classwork.type === "assignment";

  return (
    <div className="p-10 max-w-5xl mx-auto flex gap-6">
      {/* Left Side - Main Content */}
      <div className="flex-1">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          {isAssignment ? (
            <NotebookPen className="w-7 h-7 text-purple-600" />
          ) : (
            <NotebookText className="w-7 h-7 text-purple-600" />
          )}
          <h1 className="text-2xl font-bold">{classwork.title}</h1>
        </div>

        {/* Author & Date */}
        <p className="text-gray-700 mt-2">
          {classwork.author?.name} • {new Date(classwork.createdAt).toLocaleDateString()}
        </p>

        {/* Content */}
        <p className="text-gray-800 mt-4">{classwork.content}</p>

        {/* Assignment-specific details */}
        {isAssignment && (
          <>
            <p className="text-gray-600 mt-2">Due Date: {classwork.dueDate ? new Date(classwork.dueDate).toLocaleDateString() : "No due date"}</p>
            <p className="text-gray-600">Points: {classwork.points ?? "Ungraded"}</p>
          </>
        )}

        {/* Material-specific details */}
        {!isAssignment && classwork.files?.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Attached Files:</p>
            {classwork.files.map((file: any) => (
              <a key={file.id} href={file.fileUrl} target="_blank" className="block text-blue-600 underline mt-1">
                {file.fileUrl}
              </a>
            ))}
          </div>
        )}

        {/* Class Comments */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
          <p className="font-semibold">Class comments</p>
          <input
            type="text"
            className="mt-2 p-2 w-full border rounded-md"
            placeholder="Add a class comment"
          />
        </div>
      </div>

      {/* Right Side - "Your Work" Section for Assignments */}
      {isAssignment && (
        <div className="w-72 p-4 border rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">
            Your work <span className="ml-20 font-normal text-green-600">Assigned</span>
          </p>

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
