"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  YAxis
} from "recharts";
import { useParams } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SUBMISSION_ASSIGNMENT_API, PLACEHOLDER_IMAGE } from "@/lib/api_routes";

export default function AnalyticsPage() {
  const { id: classroomId } = useParams();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const COLORS = {
    green: "#5CB338",
    orange: "#FFA447",
    red: "#FB4141",
    purple: "#7E1891",
    blue: "#2D82B7"
  };

  useEffect(() => {
    if (!classroomId) return;

    const fetchData = async () => {
      const res = await fetch(SUBMISSION_ASSIGNMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId }),
      });

      const data = await res.json();
      setAssignments(data.assignments || []);
      setStudents(data.students || []);
      setLoading(false);
    };

    fetchData();
  }, [classroomId]);

  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignment) {
      setSelectedAssignment(assignments[0].title);
    }
  }, [assignments]);

  const averageScores = assignments.map((a) => {
    const graded = a.submissions.filter((s: any) => s.grade?.score !== undefined);
    const avgScore = graded.length > 0
      ? graded.reduce((sum: number, s: any) => sum + parseFloat(s.grade.score), 0) / graded.length
      : 0;
    return { name: a.title, avgScore };
  });

  const avgScoreByTitle = averageScores.find((a) => a.name === selectedAssignment)?.avgScore || 0;

  const topPerformingAssignments = [...averageScores].sort((a, b) => b.avgScore - a.avgScore);

  const hardestAssignments = [...averageScores].sort((a, b) => a.avgScore - b.avgScore);

  const submissionStatusData = assignments.reduce((acc: any, assignment: any) => {
    const stats = { "On Time": 0, "Late": 0, "Not Submitted": 0 };

    students.forEach((student: any) => {
      const submission = assignment.submissions.find((s: any) => s.studentId === student.id);
      if (!submission) {
        stats["Not Submitted"]++;
      } else {
        const due = new Date(assignment.dueDate);
        const submitted = new Date(submission.submittedAt);
        stats[submitted <= due ? "On Time" : "Late"]++;
      }
    });

    acc[assignment.title] = [
      { name: "On Time", value: stats["On Time"], color: COLORS.green },
      { name: "Late", value: stats["Late"], color: COLORS.orange },
      { name: "Not Submitted", value: stats["Not Submitted"], color: COLORS.red },
    ];
    return acc;
  }, {});

  const totalAssignments = assignments.length;
  const studentProgress = students.map((student) => {
    const submittedCount = assignments.reduce((count, assignment) => {
      return assignment.submissions.some((s: any) => s.studentId === student.id) ? count + 1 : count;
    }, 0);

    return {
      ...student,
      submitted: submittedCount,
      avatarColor: "bg-blue-100",
    };
  });

  if (loading) {
    return <div className="p-6 text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Average Score</CardTitle>
              <CardDescription>Average grade for selected assignment</CardDescription>
            </div>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((a) => (
                  <SelectItem key={a.title} value={a.title}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: selectedAssignment, avgScore: avgScoreByTitle }]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <Tooltip />
                <Bar dataKey="avgScore" fill={COLORS.purple} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="avgScore" position="top" offset={12} fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col items-center gap-2">
            <div className="flex gap-2 font-medium leading-none">
              Average score: {avgScoreByTitle.toFixed(1)}/100
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Submission Status</CardTitle>
              <CardDescription>On time, late, and missing submissions</CardDescription>
            </div>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((a) => (
                  <SelectItem key={a.title} value={a.title}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={submissionStatusData[selectedAssignment] || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  stroke="none"
                >
                  {(submissionStatusData[selectedAssignment] || []).map((entry, index) => (
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
              Total students: {(submissionStatusData[selectedAssignment] || []).reduce((sum, item) => sum + item.value, 0)}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Score Trend Over Time */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Score Trend Over Time</CardTitle>
          <CardDescription>Average score across assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={averageScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgScore" stroke={COLORS.purple} strokeWidth={2} dot={{r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
            <CardDescription>Histogram of scores for selected assignment</CardDescription>
          </div>
          <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select assignment" />
            </SelectTrigger>
            <SelectContent>
              {assignments.map((a) => (
                <SelectItem key={a.title} value={a.title}>{a.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={(() => {
                const selected = assignments.find(a => a.title === selectedAssignment);
                const bins = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10 + 1}-${(i + 1) * 10}`, count: 0 }));

                if (selected) {
                  selected.submissions.forEach((s: any) => {
                    if (s.grade?.score !== undefined) {
                      const score = parseFloat(s.grade.score);
                      const binIndex = Math.min(Math.floor(score / 10), 9);
                      bins[binIndex].count += 1;
                    }
                  });
                }

                return bins;
              })()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="range" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.blue} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="count" position="top" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Assignments</CardTitle>
          <CardDescription>Assignments with highest average scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPerformingAssignments.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="avgScore" fill={COLORS.green} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="avgScore" position="top" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Assignment Difficulty Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assignment Difficulty Ranking</CardTitle>
          <CardDescription>Assignments from hardest to easiest</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hardestAssignments.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="avgScore" fill={COLORS.red} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="avgScore" position="top" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Progress List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">List of students</CardTitle>
          <CardDescription>Student submission progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[360px] overflow-y-auto space-y-6 pr-2">
            {studentProgress.map((student) => (
              <div key={student.email} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar className={`h-12 w-12 ${student.avatarColor}`}>
                    <AvatarImage src={student.image || PLACEHOLDER_IMAGE} alt={student.name} />
                    <AvatarFallback>{student.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={(student.submitted / totalAssignments) * 100} className="w-44 bg-gray-200 [&>div]:bg-blue-500" />
                  <div className="text-sm font-medium text-gray-700">
                    {((student.submitted / totalAssignments) * 100).toFixed(0)}% Submitted
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
