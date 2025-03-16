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
  const [classMaterials, setClassMaterials] = useState<
    { id: string; title: string; content: string; fileUrl?: string; dueDate?: string; createdAt: string; type: string; expanded: boolean }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTopicDialog, setShowTopicDialog] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const classroomId = params?.id as string;  // Gets classroom ID
  const { type, itemId } = params;  // Retrieves type and itemId from the URL

  useEffect(() => {
    async function fetchClassMaterials() {
      if (!classroomId) {
        setError("Classroom ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/classroom/posts/classworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch class materials.");
        }

        const data = await response.json();
        // Add expanded state to each material
        const materialsWithExpanded = data.assignments.map((material) => ({
          ...material,
          expanded: false
        }));
        setClassMaterials(materialsWithExpanded);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchClassMaterials();
  }, [classroomId]);

  const handleNavigation = (type: string) => {
    router.push(`/classroom/${classroomId}/classwork/create?type=${type}`);
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
        <a href="#" className="text-purple-600 flex items-center">
          <SquareUserRound className="w-6 h-6 mr-2 text-purple-600" />
          View your work
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-purple-600 text-white rounded-full px-4 py-2 flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Create
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleNavigation("Assignment")}>Assignment</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("Material")}>Material</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Class Materials</h2>
          <MoreVertical className="text-gray-500 cursor-pointer" />
        </div>

        {classMaterials.length > 0 ? (
          classMaterials.map((material) => (
            <Card
              key={material.id}
              className="my-2 mt-transparent shadow-none border-none cursor-pointer"
              onClick={() =>
                router.push(
                  `/classroom/${classroomId}/classwork/detail/${material.type === "assignment" ? "assignment" : "material"}/${material.id}`
                )
              }
            >
              <CardHeader className="flex flex-row items-center space-x-3 p-2">
                {material.type === "assignment" ? (
                  <NotebookPen
                    className={`w-6 h-6 ${material.dueDate && !isPast(new Date(material.dueDate)) ? "text-purple-600" : "text-gray-500"}`}
                  />
                ) : (
                  <NotebookText className="w-6 h-6 text-gray-500" />
                )}
                <CardTitle className="text-base font-normal flex items-center justify-between w-full">
                  <a 
                    onClick={(e) => e.stopPropagation()} 
                    href={material.fileUrl || "#"} 
                    className="text-gray-600"
                  >
                    {material.title}
                  </a>
                  <div className="flex items-center">
                    {material.dueDate ? (
                      <span className="text-sm text-muted-foreground ml-2">
                        {`Due ${format(new Date(material.dueDate), "d MMM HH:mm")}`}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground ml-2">
                        {`Posted ${format(new Date(material.createdAt), "d MMM HH:mm")}`}
                      </span>
                    )}
                    {material.expanded ? 
                      <ChevronUp className="w-4 h-4 ml-2 text-gray-500" /> : 
                      <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                    }
                  </div>
                </CardTitle>
              </CardHeader>
              
              {material.expanded && material.type === "assignment" && (
                <CardContent className="pt-0 pb-2 px-0">
                  <div className="flex justify-end pr-2">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewWork(material.id, material.title);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Review Work
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No class materials posted yet.</p>
        )}
      </div>
    </div>
  );
}
