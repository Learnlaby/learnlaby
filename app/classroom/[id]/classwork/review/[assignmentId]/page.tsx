"use client";
import { useState } from "react";
import { Files } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ReviewWork() {
    const students = [
        { id: '1', name: 'John', fullName: 'John Doe', status: 'Turned in', avatar: 'J', avatarColor: '#F47C24', docId: '1234567890' },
        { id: '2', name: 'Jane', fullName: 'Jane Smith', status: 'Turned in', avatar: 'J', avatarColor: '#4CB5AE', docId: '0987654321' },
        { id: '3', name: 'Alice', fullName: 'Alice Johnson', status: 'Turned in', avatar: 'A', avatarColor: '#0891D1', docId: '1122334455' },
        { id: '4', name: 'Bob', fullName: 'Bob Williams', status: 'Turned in', avatar: 'B', avatarColor: '#8C54FF', docId: '2233445566' },
        { id: '5', name: 'Charlie', status: 'Not submitted', avatar: 'C', avatarColor: '#5B6BC0', docId: '3344556677' },
        { id: '6', name: 'David', status: 'Turned in', avatar: 'D', avatarColor: '#F47C24', docId: '4455667788' },
        { id: '7', name: 'Eve', fullName: 'Eve Brown', status: 'Graded', avatar: 'E', avatarColor: '#4CB5A0', docId: '5566778899' },
        { id: '8', name: 'Frank', status: 'Not submitted', avatar: 'F', avatarColor: '#0891D1', docId: '6677889900' },
        { id: '9', name: 'Grace', status: 'Not submitted', avatar: 'G', avatarColor: '#8C54FF', docId: '7788990011' },
        { id: '10', name: 'Hank', status: 'Not submitted', avatar: 'H', avatarColor: '#5B6BC0', docId: '8899001122' },
    ];

    const [sortOption, setSortOption] = useState("status");
    const [mainFilter, setMainFilter] = useState("All");

    const filteredStudents = mainFilter === "All" ? students : students.filter(student => student.status === mainFilter);
    

    const sortStudents = (students) => {
        if (sortOption === "status") {
            return [...students].sort((a, b) => a.status.localeCompare(b.status));
        } else if (sortOption === "firstName") {
            return [...students].sort((a, b) => {
                const aFirstName = a.fullName ? a.fullName.split(' ')[0] : a.name;
                const bFirstName = b.fullName ? b.fullName.split(' ')[0] : b.name;
                return aFirstName.localeCompare(bFirstName);
            });
        } else if (sortOption === "lastName") {
            return [...students].sort((a, b) => {
                const aLastName = a.fullName ? a.fullName.split(' ')[1] || '' : '';
                const bLastName = b.fullName ? b.fullName.split(' ')[1] || '' : '';
                return aLastName.localeCompare(bLastName);
            });
        }
        return students;
    };
    
    const sortedStudents = sortStudents(students);
    
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-4">
                    <div className="relative mb-4">
                        <select 
                            className="text-sm block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-10 rounded shadow focus:outline-none focus:shadow-outline"
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="status">Sort by status</option>
                            <option value="firstName">Sort by first name</option>
                            <option value="lastName">Sort by last name</option>
                        </select>
                    </div>

                    {sortOption === "status" ? (
                        ["Turned in", "Not submitted", "Graded"].map((status) => (
                            <div key={status} className="mb-4">
                                <h3 className="text-sm font-medium px-2 py-1">{status}</h3>
                                <Separator></Separator>
                                {sortedStudents.filter(student => student.status === status).map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                                        <div className="flex items-center">
                                            <div 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                                                style={{ backgroundColor: student.avatarColor }}
                                            >
                                                {student.avatar}
                                            </div>
                                            <div className="ml-2 text-sm">{student.name}</div>
                                        </div>
                                        <div className="text-xs text-gray-500">{status === "Graded" ? "100/100" : "___/100"}</div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        sortedStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                                        style={{ backgroundColor: student.avatarColor }}
                                    >
                                        {student.avatar}
                                    </div>
                                    <div className="ml-2 text-sm">{student.name}</div>
                                </div>
                                <div className="text-xs text-gray-500">{student.status === "Graded" ? "100/100" : "___/100"}</div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Main content */}
                <div className="flex-1 overflow-auto p-10">
                    <h1 className="text-3xl font-semibold text-gray-800">Assignment</h1>
                    
                    <div className="flex mt-4 mb-6">
                        <div className="mr-12">
                            <div className="text-4xl font-medium">{students.filter(s => s.status === "Turned in" || s.status === "Graded").length}</div>
                            <div className="text-sm text-gray-500">Turned in</div>
                        </div>
                        <div>
                            <div className="text-4xl font-medium">{students.filter(s => s.status === "Not submitted").length}</div>
                            <div className="text-sm text-gray-500">Not submitted</div>
                        </div>
                    </div>
                    <div className="flex justify-end mb-4">
                        <div className="relative">
                            <select 
                                className="text-sm block bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-10 rounded shadow focus:outline-none focus:shadow-outline"
                                value={mainFilter} 
                                onChange={(e) => setMainFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Turned in">Turned in</option>
                                <option value="Graded">Graded</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredStudents.map((student) => (
                            student.status !== "Not submitted" && (
                                <div key={student.id} className="bg-white rounded shadow">
                                    <div className="p-3 border-b border-gray-100 flex items-center">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                                            style={{ backgroundColor: student.avatarColor }}
                                        >
                                            {student.avatar}
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-sm font-medium">{student.fullName || student.name}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 flex flex-col">
                                        <div className="h-32 bg-gray-100 mb-2 flex items-center justify-center">
                                            <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                                                <Files className="w-12 h-12 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className={`text-xs ${
                                                student.status === "Graded" ? "text-green-600" : 
                                                student.status === "Turned in" ? "text-purple-600" : 
                                                "text-gray-600"
                                            }`}>
                                                {student.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}