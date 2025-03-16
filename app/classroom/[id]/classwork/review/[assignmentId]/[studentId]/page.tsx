"use client";
import React from "react";
import { useSearchParams, useParams } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentWorkPage() {
    const { studentId } = useParams();
    const searchParams = useSearchParams();

    const name = searchParams.get("name") || `Student ${studentId}`;
    const status = searchParams.get("status") || "Unknown";
    const docId = searchParams.get("docId") || "No document found";

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
                    <div className={`flex items-center text-sm ${
                        status === "Graded" ? "text-green-600" : 
                        status === "Turned in" ? "text-purple-600" : 
                        "text-gray-600"
                    }`}>
                        <span>{status}</span>
                        {status === "Turned in"}
                    </div>
                </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white mr-4">
                Grade
            </Button>
        </div>

            {/* Main content area */}
            <div className="flex flex-1">
                {/* Document area */}
                <div className="flex-1 p-4 overflow-auto border-r bg-gray-50">
                </div>
                
                {/* Sidebar */}
                <div className="w-64 bg-white border-l">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-medium mb-4">Files</h3>
                        <p className="text-xs text-gray-600 mb-1">Turned in on Oct 19, 2024, 8:08 PM</p>
                        <div className="mt-4 border rounded p-2 bg-white flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm truncate">{docId}.doc</span>
                        </div>
                    </div>
                    
                    <div className="p-4 border-b">
                        <h3 className="text-lg mb-4 font-medium">Grade</h3>
                        <div className="flex items-center mb-2">
                            <input 
                                type="number" 
                                className="w-16 border rounded p-1 text-right" 
                                placeholder="0"
                            />
                            <span className="text-gray-600 ml-2">/100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
