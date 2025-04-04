"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  SUBMISSION_REVIEW_API,
  GRADE_API,
} from "@/lib/api_routes";

export default function StudentWorkPage() {
  const { studentId } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || `Student ${studentId}`;
  const submissionId = searchParams.get("docId");

  const [status, setStatus] = useState(searchParams.get("status") || "Unknown");
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [score, setScore] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;

      try {
        const res = await fetch(SUBMISSION_REVIEW_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId }),
        });

        const data = await res.json();

        if (data.submission) {
          const sub = data.submission;
          setFiles(sub.files || []);
          setSelectedFile(sub.files?.[0] || null);
          setSubmittedAt(sub.submittedAt || null);
          setScore(sub.grade?.score?.toString() || "");
        }
      } catch (error) {
        console.error("Failed to load submission:", error);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleGrade = async () => {
    if (!submissionId || !score) return;

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setMessage("Score must be between 0 and 100.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch(GRADE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          studentId,
          score: parsedScore,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Graded");
        setMessage("✅ Graded successfully!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        console.error("Grading failed:", data.error);
        setMessage("❌ Failed to grade. Try again.");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error submitting grade:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="ml-4">
          <h1 className="text-xl font-medium text-gray-700">Assignment</h1>
          <div className="flex items-center mt-3">
            <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
              {name.charAt(0)}
            </div>
            <span className="mr-2 text-gray-700">{name}</span>
            <div
              className={`flex items-center text-sm ${
                status === "Graded"
                  ? "text-green-600"
                  : status === "Turned in"
                  ? "text-purple-600"
                  : "text-gray-600"
              }`}
            >
              <span>{status}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleGrade}
          className="bg-purple-600 hover:bg-purple-700 text-white mr-4"
        >
          Grade
        </Button>
      </div>

      {message && (
        <div className={`px-4 py-2 text-sm text-center ${
          message.startsWith("✅") ? "text-green-600 border border-green-300" : "text-red-600 border border-red-300"
        }`}>
          {message}
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Document area */}
        <div className="flex-1 p-4 overflow-auto border-r bg-gray-50">
          <div className="text-gray-600 mb-2 font-medium">Preview</div>
          <div className="w-full h-[400px] bg-white border rounded shadow flex items-center justify-center">
            {selectedFile ? (
              <iframe
                src={selectedFile.url}
                title={selectedFile.name}
                className="w-full h-full"
              />
            ) : (
              <p className="text-gray-500">No file selected</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-l">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium mb-4">Files</h3>
            {submittedAt ? (
              <p className="text-xs text-gray-600 mb-1">
                Turned in on {new Date(submittedAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-xs text-gray-600 mb-1">Not submitted yet</p>
            )}
            <div className="mt-4 space-y-2">
              {files.length > 0 ? (
                files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left flex items-center p-2 border rounded ${
                      selectedFile?.id === file.id
                        ? "bg-gray-100 border-purple-500"
                        : "bg-white"
                    }`}
                  >
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm truncate">{file.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No files submitted</p>
              )}
            </div>
          </div>

          <div className="p-4 border-b">
            <h3 className="text-lg mb-4 font-medium">Grade</h3>
            <div className="flex items-center mb-2">
              <input
                type="number"
                className="w-16 border rounded p-1 text-right"
                placeholder="0"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
              <span className="text-gray-600 ml-2">/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}