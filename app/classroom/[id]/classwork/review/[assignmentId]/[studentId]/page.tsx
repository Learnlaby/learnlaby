import React from 'react';
import { ArrowLeft, ArrowRight, FileText, MoreVertical, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentWorkPage({ params }: { params: { id: string, assignmentId: string, studentId: string } }) {
    const getStudentInfo = (studentId: string) => {
        return {
            name: `Student ${studentId}`,
            avatarLetter: studentId.charAt(0).toUpperCase(),
            avatarColor: "bg-orange-500",
            documentId: `${studentId}: Week15.docx`
        };
    };

    const studentInfo = getStudentInfo(params.studentId);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="border-b flex items-center justify-between p-4">
                <div className="flex items-center">
                    <h1 className="text-lg font-normal text-gray-700 mr-8">Week15 Assignment</h1>
                    <div className="flex items-center">
                        <div className={`${studentInfo.avatarColor} text-white w-8 h-8 rounded-full flex items-center justify-center mr-2`}>
                            {studentInfo.avatarLetter}
                        </div>
                        <span className="mr-2 text-gray-700">{studentInfo.name}</span>
                        <div className="flex items-center text-blue-600 text-sm mr-2">
                            <span>Turned in</span>
                            <CheckCircle className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mr-2">Return</Button>
                </div>
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
                        <a href="#" className="text-xs text-blue-600">See history</a>
                        
                        <div className="mt-4 border rounded p-2 bg-white flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm truncate">{studentInfo.documentId}</span>
                        </div>
                    </div>
                    
                    <div className="p-4 border-b">
                        <h3 className="text-lg mb-4 font-medium">Grade</h3>
                        <div className="flex items-center justify-between mb-2">
                            <input 
                                type="number" 
                                className="w-16 border rounded p-1 text-right" 
                                placeholder="0"
                            />
                            <span className="text-gray-600">/100</span>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm">
                                Grade
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}