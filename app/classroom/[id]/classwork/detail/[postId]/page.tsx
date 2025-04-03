"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NotebookText, NotebookPen, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Add interface for Comment
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
}

export default function ClassworkDetailPage() {
  const { postId } = useParams();
  const [classwork, setClasswork] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const postDetailAPI = "/api/classroom/posts/detail";
  const submissionAPI = "/api/classroom/submission/get";
  const commentOnPostAPI = `/api/classroom/comment?postId=${postId}`;
  const createSubmissionAPI = "/api/classroom/submission/create";
  const commentAPI = "/api/classroom/comment";
  
  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  // Fetch classwork detail
  useEffect(() => {
    async function fetchClassworkDetails() {
      if (!postId) return;

      try {
        const response = await fetch(postDetailAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (!response.ok) throw new Error("Failed to fetch classwork details.");

        const data = await response.json();
        setClasswork(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchClassworkDetails();
  }, [postId]);

  // Fetch user submission
  useEffect(() => {
    async function fetchSubmission() {
      if (!postId) return;

      const res = await fetch(submissionAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmission(data);
      }
    }

    fetchSubmission();
  }, [postId]);

  // Fetch comments for the post
  useEffect(() => {
    async function fetchComments() {
      if (!postId) return;

      try {
        const response = await fetch(commentOnPostAPI);
        if (!response.ok) {
          console.error("Failed to fetch comments for post", postId);
          return;
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    fetchComments();
  }, [postId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!postId || selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("postId", postId as string);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(createSubmissionAPI, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setSubmission(data.submission);
      alert("Submission successful!");
    } else {
      alert("Submission failed.");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || !postId) return;

    setSubmittingComment(true);

    try {
      const response = await fetch(commentAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: commentContent,
        }),
      });

      if (!response.ok) throw new Error("Failed to create comment");

      const newComment: Comment = await response.json();
      setComments(prev => [...prev, newComment]);
      setCommentContent(""); // Clear input after successful submission
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!classwork) return <div>No classwork found.</div>;

  const isAssignment = classwork.type === "assignment";

  return (
    <div className="p-10 max-w-5xl mx-auto flex gap-6">
      {/* Left */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {isAssignment ? (
            <NotebookPen className="w-7 h-7 text-purple-600" />
          ) : (
            <NotebookText className="w-7 h-7 text-purple-600" />
          )}
          <h1 className="text-2xl font-bold">{classwork.title}</h1>
        </div>

        <p className="text-gray-700 mt-2">
          {classwork.author?.name} • {new Date(classwork.createdAt).toLocaleDateString()}
        </p>

        {isAssignment && (
          <div className="flex justify-between">
            <p className="text-gray-600">Points: {classwork.maxScore ?? "Ungraded"}</p>
            <p className="text-gray-600">Due: {classwork.dueDate ? new Date(classwork.dueDate).toLocaleDateString() : "No due date"}</p>
          </div>
        )}

        <p className="text-gray-800 mt-4 p-4 border rounded-lg shadow-lg">{classwork.content}</p>

        {classwork.files?.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold mb-2">Attached Files:</p>
            <div className="space-y-2">
              {classwork.files.map((file: any) => {
                const fileName = file.url.split("/").pop();
                return (
                  <div
                    key={file.id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm border"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      className="truncate max-w-[220px] text-blue-600 hover:underline"
                    >
                      {fileName}
                    </a>
                    <span className="text-gray-500 text-xs">View</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Class Comments */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h4 className="font-semibold text-lg mb-4">Class comments</h4>
          
          <Separator className="mb-4" />
          
          {/* Display comments */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments && comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    {comment.user.image && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{comment.user.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
          
          {/* Add new comment */}
          <div className="flex items-center space-x-2">
            <textarea
              className="w-full h-10 border rounded-2xl bg-white placeholder:text-gray-400 pl-3 pt-2 text-sm"
              placeholder="Add your comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            />
            <button
              className="px-2 py-2 bg-white hover:bg-gray-100 rounded-full text-purple-500 disabled:text-gray-300"
              onClick={handleCommentSubmit}
              disabled={submittingComment || !commentContent?.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right */}
      {isAssignment && (
        <div className="w-72 p-4 border rounded-lg shadow-lg">
          <div className="flex justify-between">
            <p className="font-bold text-gray-800">Your work</p>
            <span className="font-normal text-sm text-purple-600">
              {(() => {
                if (submission) {
                  if (submission.grade) {
                    return `${submission.grade.score}/${classwork.maxScore ?? "?"}`;
                  } else if (
                    classwork.dueDate &&
                    new Date(submission.submittedAt) > new Date(classwork.dueDate)
                  ) {
                    return "Turned in late";
                  } else {
                    return "Submitted";
                  }
                } else {
                  if (
                    classwork.dueDate &&
                    new Date() > new Date(classwork.dueDate)
                  ) {
                    return "Turn in late";
                  } else {
                    return "Assigned";
                  }
                }
              })()}
            </span>
          </div>

          {submission ? (
            <div className="mt-2 text-green-600 text-sm">
              <p>✅ Submitted on {new Date(submission.submittedAt).toLocaleDateString()} {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              {submission.files?.length > 0 && (
                <div className="mt-4 space-y-2">
                  {submission.files.map((file: any) => {
                    const fileName = file.url.split("/").pop();
                    return (
                      <div
                        key={file.id}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded-md text-sm border"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          className="truncate max-w-[160px] text-blue-600 hover:underline"
                        >
                          {fileName}
                        </a>
                        <span className="text-gray-500 text-xs">View</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Custom Styled Trigger Button */}
              <label htmlFor="file-upload">
                <div className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-dashed border-gray-400 rounded-lg text-sm text-gray-600 cursor-pointer text-center">
                  Click to choose file(s)
                </div>
              </label>

              {/* Preview Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm border"
                    >
                      <span className="truncate max-w-[160px]">{file.name}</span>
                      <button
                        onClick={() => {
                          setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className="mt-4 w-full bg-purple-600 text-white"
                onClick={handleSubmit}
                disabled={selectedFiles.length === 0}
              >
                Submit Work
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}