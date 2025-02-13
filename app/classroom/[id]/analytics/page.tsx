"use client"
import { BarChart, LineChart } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data to match the image
const performanceData = [
  { month: "Oct 2021", assignment: 7, quiz: 4 },
  { month: "Nov 2021", assignment: 7.5, quiz: 6 },
  { month: "Dec 2021", assignment: 5.5, quiz: 4 },
  { month: "Jan 2022", assignment: 8, quiz: 6 },
  { month: "Feb 2022", assignment: 7, quiz: 5 },
  { month: "Mar 2022", assignment: 7, quiz: 4.5 },
]

const completionData = [
  { name: "Homework A", value: 1 },
  { name: "Homework B", value: 5 },
  { name: "Homework C", value: 3 },
  { name: "Homework D", value: 10 },
]

const students = [
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxx@ku.th",
    performance: "+16%",
    status: "Lorem ipsum dolor",
    avatarColor: "bg-pink-100",
  },
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxx@ku.th",
    performance: "-4%",
    status: "Lorem ipsum dolor",
    avatarColor: "bg-blue-100",
  },
  {
    name: "XXXXX XXXXXX",
    id: "6510545xxx",
    email: "xxxxxxxxxx@ku.th",
    performance: "+25%",
    status: "Lorem ipsum dolor",
    avatarColor: "bg-yellow-100",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Overall Performance Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-md">
          <div className="mb-2 font-semibold text-lg">Overall Performance</div>
          <div className="h-[300px]">
            <LineChart
              data={performanceData}
              categories={["assignment", "quiz"]}
              index="month"
              colors={["#E9967A", "#8A2BE2"]}
              valueFormatter={(value) => `${value}/10`}
              className="h-[300px]"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#E9967A]" />
              <span className="text-sm text-gray-500">Assignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#8A2BE2]" />
              <span className="text-sm text-gray-500">Quiz</span>
            </div>
          </div>
        </div>

        {/* Assignment Completion Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-md">
          <div className="mb-2 font-semibold text-lg">Assignment Completion</div>
          <div className="h-[300px]">
            <BarChart
              data={completionData}
              categories={["value"]}
              index="name"
              colors={["#8A2BE2"]}
              valueFormatter={(value) => `${value}`}
              className="h-[300px]"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {completionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#8A2BE2]" />
                <span className="text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Student List */}
      <div className="rounded-xl border bg-white p-6 shadow-md">
        <div className="mb-2 font-semibold text-lg">List of students</div>
        <div className="space-y-6">
          {students.map((student) => (
            <div key={student.email} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className={`h-12 w-12 ${student.avatarColor}`}>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>XX</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.id}</div>
                </div>
              </div>
              <div className="grid gap-1 text-right">
                <div className="text-sm">{student.email}</div>
                <div className={`text-sm ${student.performance.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                  {student.performance}
                </div>
              </div>
              <div className="text-sm text-gray-500">{student.status}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}



