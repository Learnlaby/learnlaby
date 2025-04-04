"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, NotebookText, NotebookPen, Send } from "lucide-react";
import { format, isPast } from "date-fns";
import { useSession } from "next-auth/react";
import {
  CLASSROOM_MEMBER_API,
  CLASSWORK_API,
  COMMENT_API,
  SECTION_CREATE_API,
  CLASSWORK_CREATE_PAGE,
  CLASSWORK_REVIEW_PAGE,
  CLASSWORK_DETAIL_PAGE,
} from "@/lib/api_routes";

// Add interfaces for our data models
interface User {
  id: string;
  name?: string;
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface Post {
  id: string;
  title: string;
  dueDate?: string;
  createdAt: string;
  type: string;
  comments?: Comment[];
  sectionId?: string;
  section?: {
    name: string;
  };
}

interface Section {
  id: string;
  name: string;
  posts: Post[];
}

interface ClassroomMember {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

export default function Classwork() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  // State for comments
  const [commentContents, setCommentContents] = useState<{[postId: string]: string}>({});
  const [submittingComments, setSubmittingComments] = useState<{[postId: string]: boolean}>({});

  const params = useParams();
  const router = useRouter();
  const classroomId = params?.id as string;
  const { data: session } = useSession();

  const isTeacher = userRole === "teacher" || userRole === "co-teacher";

  useEffect(() => {
    async function fetchUserRole() {
      if (!classroomId || !session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(CLASSROOM_MEMBER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classroom members.");
        }

        const data = await response.json();
        const members: ClassroomMember[] = data.members;

        // Find the current user in the classroom members
        const currentUserEmail = session.user.email;
        const currentMember = members.find(member => member.email === currentUserEmail);

        if (currentMember) {
          setUserRole(currentMember.role);
        } else {
          setUserRole("Not a member");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole("Unknown");
      }
    }

    async function fetchClasswork() {
      if (!classroomId) {
        setError("Classroom ID is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch all classwork posts with section details
        const classworkResponse = await fetch(CLASSWORK_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!classworkResponse.ok) {
          throw new Error("Failed to fetch classwork.");
        }

        const classworkData = await classworkResponse.json();
        const allPosts = classworkData.assignments || [];

        // Initialize posts with empty comments array and fetch comments for each post
        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            const comments = await fetchComments(post.id);
            return { ...post, comments };
          })
        );

        // Group posts by section
        const groupedSections: { [key: string]: { id: string; name: string; posts: any[] } } = {};

        postsWithComments.forEach((post) => {
          if (post.section && post.section.name) {
            const sectionId = post.sectionId;
            if (!groupedSections[sectionId]) {
              groupedSections[sectionId] = { id: sectionId, name: post.section.name, posts: [] };
            }
            groupedSections[sectionId].posts.push(post);
          }
        });

        // Convert grouped sections into an array
        const formattedSections = Object.values(groupedSections);

        // Identify posts without a section and group them as "All Materials"
        const unclassifiedPosts = postsWithComments.filter((post) => !post.sectionId);

        if (unclassifiedPosts.length > 0) {
          formattedSections.push({
            id: "all-materials",
            name: "All Materials",
            posts: unclassifiedPosts,
          });
        }

        // Update state
        setSections(formattedSections);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    Promise.all([fetchUserRole(), fetchClasswork()])
      .finally(() => setLoading(false));

  }, [classroomId, session]);

  // Function to fetch comments for a post
  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`${COMMENT_API}?postId=${postId}`);
      if (!response.ok) {
        console.error("Failed to fetch comments for post", postId);
        return [];
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching comments:", err);
      return [];
    }
  };

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) {
      alert("Section name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(SECTION_CREATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId, name: newSectionName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create section.");
      }

      const newSection = await response.json();
      setSections([...sections, { id: newSection.id, name: newSection.name, posts: [] }]); // Append new section
      setShowSectionDialog(false);
      setNewSectionName("");
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  // Comment handling functions
  const handleCommentChange = (postId: string, content: string) => {
    setCommentContents(prev => ({
      ...prev,
      [postId]: content
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentContents[postId];
    if (!content?.trim()) return;

    setSubmittingComments(prev => ({
      ...prev,
      [postId]: true
    }));

    try {
      const response = await fetch(COMMENT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) throw new Error("Failed to create comment");

      const newComment: Comment = await response.json();

      // Update the posts in the sections state with the new comment
      setSections(prevSections =>
        prevSections.map(section => ({
          ...section,
          posts: section.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newComment]
              };
            }
            return post;
          })
        }))
      );

      // Clear the comment input for this post
      setCommentContents(prev => ({
        ...prev,
        [postId]: ""
      }));
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComments(prev => ({
        ...prev,
        [postId]: false
      }));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading classwork...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-10">
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between mb-2">
          <a href="" className="text-purple-600 flex items-center">
            WELCOME TO CLASSWORK
          </a>

          {isTeacher && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-purple-600 text-white rounded-full px-4 py-2 flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowSectionDialog(true)}>New Section</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(CLASSWORK_CREATE_PAGE.replace("[classroomId]", classroomId) + "?type=Assignment")}>
                  Assignment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(CLASSWORK_CREATE_PAGE.replace("[classroomId]", classroomId) + "?type=Material")}>
                  Material
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Dialog for Creating New Section */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>Enter a name for the new section</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="sectionName" className="text-right">Section Name</Label>
            <Input id="sectionName" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSection} className="bg-purple-600 text-white">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Display Sections with Class Materials */}
      {sections.length > 0 &&
        sections.map((section) => (
          <div key={section.id} className="mt-6">
            <div className="flex justify-between items-center pb-2 border-b border-gray-300 mb-4">
              <h2 className="text-lg font-semibold">{section.name}</h2>
            </div>

            {section.posts.length > 0 ? (
              <div className="space-y-4">
                {section.posts.map((post) => (
                  <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow">
                    {/* Updated header with all elements in one row */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center flex-grow">
                        {post.type === "assignment" ? (
                          <NotebookPen className={`w-6 h-6 mr-3 flex-shrink-0 ${post.dueDate && !isPast(new Date(post.dueDate)) ? "text-purple-600" : "text-gray-500"}`} />
                        ) : (
                          <NotebookText className="w-6 h-6 mr-3 flex-shrink-0 text-gray-500" />
                        )}
                        <div>
                          <CardTitle
                            className="text-base font-medium cursor-pointer"
                            onClick={() => router.push(CLASSWORK_DETAIL_PAGE.replace("[classroomId]", classroomId).replace("[postId]", post.id))}
                          >
                            {post.title}
                          </CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {post.dueDate ? (
                              <span>
                                Due {format(new Date(post.dueDate), "d MMM HH:mm a")}
                              </span>
                            ) : (
                              <span>Posted {format(new Date(post.createdAt), "d MMM HH:mm a")}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {post.type === "assignment" && isTeacher && (
                        <Button
                          variant="outline"
                          className="text-purple-600 border-purple-600 hover:bg-purple-50 ml-4 whitespace-nowrap"
                          onClick={() => router.push(CLASSWORK_REVIEW_PAGE.replace("[classroomId]", classroomId).replace("[postId]", post.id))}
                        >
                          Review Work
                        </Button>
                      )}
                    </div>

                    <CardContent className="pt-0">
                      <Separator className="my-4" />
                      <div className="mt-2">
                        <h4 className="text-sm font-semibold mb-2">Comments</h4>

                        {/* Display comments */}
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {post.comments && post.comments.length > 0 ? (
                            post.comments.map(comment => (
                              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                  {comment.user.image && (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                      <Image 
                                        src={comment.user.image}
                                        alt={comment.user.name || "User"}
                                        layout="fill"
                                        objectFit="cover"
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
                            value={commentContents[post.id] || ""}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleCommentSubmit(post.id);
                              }
                            }}
                          />
                          <button
                            className="px-2 py-2 bg-white hover:bg-gray-100 rounded-full text-purple-500 disabled:text-gray-300"
                            onClick={() => handleCommentSubmit(post.id)}
                            disabled={submittingComments[post.id] || !commentContents[post.id]?.trim()}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No posts in this section.</p>
            )}
          </div>
        ))}
    </div>
  );
}
