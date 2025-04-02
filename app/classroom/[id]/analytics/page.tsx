"use client"
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for assignments
const assignmentsData = [
  { name: "Assignment 1", avgScore: 75 },
  { name: "Assignment 2", avgScore: 68 },
  { name: "Assignment 3", avgScore: 82 },
  { name: "Assignment 4", avgScore: 71 },
  { name: "Assignment 5", avgScore: 65 },
];

// Sample data for submission status
const submissionStatusData = {
  "Assignment 1": [
    { name: "On Time", value: 15, color: "#5CB338" },
    { name: "Late", value: 7, color: "#FFA447" },
    { name: "Not Submitted", value: 3, color: "#FB4141" },
  ],
  "Assignment 2": [
    { name: "On Time", value: 12, color: "#5CB338" },
    { name: "Late", value: 9, color: "#FFA447" },
    { name: "Not Submitted", value: 4, color: "#FB4141" },
  ],
  "Assignment 3": [
    { name: "On Time", value: 18, color: "#5CB338" },
    { name: "Late", value: 4, color: "#FFA447" },
    { name: "Not Submitted", value: 3, color: "#FB4141" },
  ],
  "Assignment 4": [
    { name: "On Time", value: 14, color: "#5CB338" },
    { name: "Late", value: 8, color: "#FFA447" },
    { name: "Not Submitted", value: 3, color: "#FB4141" },
  ],
  "Assignment 5": [
    { name: "On Time", value: 10, color: "#5CB338" },
    { name: "Late", value: 10, color: "#FFA447" },
    { name: "Not Submitted", value: 5, color: "#FB4141" },
  ],
};

const students = [
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxx@ku.th",
    performance: "+16%",
    status: "All assignments submitted",
    avatarColor: "bg-pink-100",
  },
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxy@ku.th",
    performance: "-4%",
    status: "Missing 2 assignments",
    avatarColor: "bg-blue-100",
  },
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxz@ku.th",
    performance: "+25%",
    status: "1 late submission",
    avatarColor: "bg-yellow-100",
  },
];

// calculate average scores and trends
const avgScore = assignmentsData.reduce((sum, item) => sum + item.avgScore, 0) / assignmentsData.length;

export default function AnalyticsPage() {
  const [selectedAssignment, setSelectedAssignment] = useState("Assignment 1");
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Average Score by Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Assignment Scores</CardTitle>
            <CardDescription>Performance across all assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={assignmentsData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#7E1891" radius={8}>
                  <LabelList
                    dataKey="avgScore"
                    position="top"
                    formatter={(value) => `${value.toFixed(2)}`}
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col items-center gap-2">
            <div className="flex gap-2 font-medium leading-none">
              Overall average scores: {avgScore.toFixed(1)}/100
            </div>
          </CardFooter>
        </Card>
                  
          {/* Submission Status */}
          <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Submission Status</CardTitle>
              <CardDescription>On time, late, and missing submissions</CardDescription>
            </div>
            <Select
              value={selectedAssignment}
              onValueChange={setSelectedAssignment}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(submissionStatusData).map((assignment) => (
                  <SelectItem key={assignment} value={assignment}>
                    {assignment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={submissionStatusData[selectedAssignment]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {submissionStatusData[selectedAssignment].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col items-end gap-2">
            <div className="flex gap-2 font-medium leading-none text-gray-600">
            Total students: {submissionStatusData[selectedAssignment].reduce((sum, item) => sum + item.value, 0)}
            </div>
          </CardFooter>
        </Card>
      </div>
      
    </div>
  )
}