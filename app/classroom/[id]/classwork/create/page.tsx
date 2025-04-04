"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ChevronDown, NotebookText, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

export default function CreateClasswork() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classroomId = params?.id as string;
  const type = searchParams?.get("type") || "Assignment";

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [maxScore, setMaxScore] = useState<number | null>(100);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const router = useRouter();

  const sectionAPI = "/api/classroom/posts/section";
  const createAssimentAPI = "/api/classroom/posts/assignment/create";
  const createMaterialAPI = "/api/classroom/posts/material/create";
  const classworkPage = "/classroom/[classroomId]/classwork";

  useEffect(() => {
    async function fetchTopics() {
      if (!classroomId) return;
      try {
        const response = await fetch(sectionAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch topics.");
        }

        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }

    fetchTopics();
  }, [classroomId]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files)); // Store selected files
    }
  };

  const handleCreateClick = async () => {
    if (!classroomId || !title) {
      alert("Title are required.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for submission
      const formData = new FormData();
      formData.append("classroomId", classroomId);
      formData.append("title", title);
      formData.append("content", instructions);
      if (selectedTopic) {
        formData.append("topicId", selectedTopic);
      }
      if (type === "Assignment" && dueDate) {
        formData.append("dueDate", dueDate.toISOString());
        formData.append("maxScore", maxScore?.toString() || "100");
      }

      files.forEach((file) => formData.append("files", file)); // Attach selected files

      let apiEndpoint = createAssimentAPI;
      if (type === "Material") {
        apiEndpoint = createMaterialAPI;
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData, // Send as FormData
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${type.toLowerCase()}.`);
      }

      router.push(classworkPage.replace("[classroomId]", classroomId));
    } catch (error) {
      console.error(`Error creating ${type.toLowerCase()}:`, error);
      alert(`Error creating ${type.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-sm p-4 flex items-center border-b">
        <div className="flex items-center text-black-600 space-x-4">
          <Button
            className="text-purple-600 bg-transparent hover:bg-gray-200 px-2 py-1 rounded-md"
            onClick={() => router.push(classworkPage.replace("[classroomId]", classroomId))}
          >
            ← Back
          </Button>
          {type === "Assignment" ? (
            <NotebookPen className="text-purple-600 ml-3" />
          ) : (
            <NotebookText className="text-purple-600 ml-3" />
          )}
          <h2 className="text-lg">{type}</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button className="bg-purple-600 text-white mr-3" onClick={handleCreateClick} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Assignment/Material form */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full border-b border-gray-300 py-2 mb-4 focus:outline-none focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Instructions (optional)"
              className="w-full min-h-32 py-2 mb-4 focus:outline-none"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />

            {/* File Upload Input */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700">Attach Files</label>
              <input
                type="file"
                multiple
                className="w-full border border-gray-300 p-2 rounded-lg mt-2"
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">{files.length} file(s) selected</p>
              )}
            </div>
          </div>
        </div>

        {/* Settings (only for assignments) */}
        <div className="w-full md:w-80 p-4 border-t md:border-t-0 md:border-l bg-white">
          <div className="space-y-6">
            {/* Assignment Settings */}
            {type === "Assignment" && (
              <>
                <div>
                  <p className="text-sm text-black-500 mb-2">Points</p>
                  <div className="relative">
                    <select
                      className="w-full p-2 text-sm border rounded-md appearance-none bg-white text-gray-600"
                      value={maxScore !== null ? maxScore : "null"}
                      onChange={(e) => setMaxScore(e.target.value === "null" ? null : Number(e.target.value))}
                    >
                      <option value={100}>100</option>
                      <option value="null">Ungraded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-black-500 mb-2">Due Date</p>
                  <div className="relative">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        className="w-full"
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </>
            )}

            {/* Topic Selection (for all types) */}
            <div>
              <p className="text-sm text-black-500 mb-2">Topic</p>
              <div className="relative mb-10">
                <select
                  className="w-full p-2 text-sm border rounded-md appearance-none bg-white text-gray-600"
                  value={selectedTopic || ""}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  <option value="">No topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
