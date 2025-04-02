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

// calculate average scores and trends
const avgScore = assignmentsData.reduce((sum, item) => sum + item.avgScore, 0) / assignmentsData.length;

export default function AnalyticsPage() {

  
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
                <Bar dataKey="avgScore" fill="#C68EFD" radius={8}>
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

      </div>

    </div>
  )
}