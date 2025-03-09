"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MoreVertical, FileText, SquareUserRound, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Classwork() {
  const [classMaterials, setClassMaterials] = useState<
    { id: string; title: string; content: string; fileUrl?: string; dueDate?: string; createdAt: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showTopicDialog, setShowTopicDialog] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const classroomId = params?.id as string;

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
        setClassMaterials(data.assignments);
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
            {/* <DropdownMenuItem onClick={() => setShowTopicDialog(true)}>Topic</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handleNavigation("Assignment")}>Assignment</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("Material")}>Material</DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleNavigation("Question")}>Question</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <Dialog open={showTopicDialog} onOpenChange={setShowTopicDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>Enter a name for the new topic</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-10">
              <Label htmlFor="topic" className="text-right">Topic</Label>
              <Input id="topic" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTopicDialog(false)} className="bg-purple-600 text-white">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <div>
        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Class Materials</h2>
          <MoreVertical className="text-gray-500 cursor-pointer" />
        </div>

        {classMaterials.length > 0 ? (
          classMaterials.map((material) => (
            <Card key={material.id} className="my-2 mt-transparent shadow-none border-none">
              <CardHeader className="flex flex-row items-center space-x-3 p-2">
                <FileText className="text-gray-500" />
                <CardTitle className="text-base font-normal flex items-center justify-between w-full">
                  <a href={material.fileUrl || "#"} className="text-gray-600">
                    {material.title}
                  </a>
                  {material.dueDate ? (
                    <span className="text-sm text-muted-foreground ml-2">
                      {`Due ${format(new Date(material.dueDate), "d MMM HH:mm")}`}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground ml-2">
                      {`Posted ${format(new Date(material.createdAt), "d MMM HH:mm")}`}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground mt-4">No class materials posted yet.</p>
        )}
      </div>
    </div>
  );
}
