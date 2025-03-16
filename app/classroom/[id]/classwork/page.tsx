"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MoreVertical, SquareUserRound, Plus, NotebookText, NotebookPen, ChevronDown, ChevronUp } from "lucide-react";
import { format, isPast } from "date-fns";

export default function Classwork() {
  const [sections, setSections] = useState<
    { id: string; name: string; posts: { id: string; title: string; dueDate?: string; createdAt: string; type: string }[] }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const classroomId = params?.id as string;

  useEffect(() => {
    async function fetchClasswork() {
      if (!classroomId) {
        setError("Classroom ID is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch all classwork posts with section details
        const classworkResponse = await fetch("/api/classroom/posts/classworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!classworkResponse.ok) {
          throw new Error("Failed to fetch classwork.");
        }

        const classworkData = await classworkResponse.json();
        const allPosts = classworkData.assignments || [];

        // Group posts by section
        const groupedSections: { [key: string]: { id: string; name: string; posts: any[] } } = {};

        allPosts.forEach((post) => {
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
        const unclassifiedPosts = allPosts.filter((post) => !post.sectionId);

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

    fetchClasswork();
  }, [classroomId]);

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) {
      alert("Section name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/classroom/posts/section/create", {
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

  const toggleExpanded = (id: string) => {
    setClassMaterials(prev =>
      prev.map(material =>
        material.id === id ? { ...material, expanded: !material.expanded } : material
      )
    );
  };

  const handleReviewWork = (materialId: string, materialTitle: string) => {
    // Navigate to the review page for this specific assignment
    router.push(`/classroom/${classroomId}/classwork/review/${materialId}?title=${encodeURIComponent(materialTitle)}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading classwork...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-4">
        <a href="" className="text-purple-600 flex items-center">
          {/* <SquareUserRound className="w-6 h-6 mr-2 text-purple-600" />
          View your work */}
          WELCOME TO CLASSWORK
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-purple-600 text-white rounded-full px-4 py-2 flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowSectionDialog(true)}>New Section</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/classroom/${classroomId}/classwork/create?type=Assignment`)}>
              Assignment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/classroom/${classroomId}/classwork/create?type=Material`)}>
              Material
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      {sections.map((section) => (
        <div key={section.id} className="mt-6">
          <div className="flex justify-between items-center pb-2 border-b border-gray-300">
            <h2 className="text-lg font-semibold">{section.name}</h2>
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>
          {section.posts.length > 0 ? (
            section.posts.map((post) => (
              <Card
                key={post.id}
                className="my-2 shadow-none border-none cursor-pointer"
                onClick={() =>
                  router.push(
                    `/classroom/${classroomId}/classwork/detail/${post.id}`
                  )
                }
              >
                <CardHeader className="flex flex-row items-center space-x-3 p-2">
                  {post.type === "assignment" ? (
                    <NotebookPen className={`w-6 h-6 ${post.dueDate && !isPast(new Date(post.dueDate)) ? "text-purple-600" : "text-gray-500"}`} />
                  ) : (
                    <NotebookText className="w-6 h-6 text-gray-500" />
                  )}
                  <CardTitle className="text-base font-normal flex items-center justify-between w-full">
                    {post.title}
                    {post.dueDate ? (
                      <span className="text-sm text-muted-foreground ml-2">
                        {`Due ${format(new Date(post.dueDate), "d MMM HH:mm")}`}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground ml-2">
                        {`Posted ${format(new Date(post.createdAt), "d MMM HH:mm")}`}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No posts in this section.</p>
          )}
        </div>
      ))}
    </div>
  );
}
