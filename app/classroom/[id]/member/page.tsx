// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
import React from 'react'

export default function PeoplePage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1">
        {/* People List */}
        {/* <ScrollArea className="h-[calc(100vh-4rem)] p-6"> */}
          <div className="space-y-8">
            {/* Teacher Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Teacher</h2>
              <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                {/* <Avatar>
                  <AvatarImage
                    src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XambV7vLYX2uGTASBtpWt0TwJX9pQ0.png`}
                    alt="Teacher"
                  />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar> */}
                <span>Lorem Ipsum</span>
              </div>
            </div>

            {/* Students Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Student</h2>
                <span className="text-sm text-muted-foreground">22 Students</span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg">
                    {/* <Avatar>
                      <AvatarImage
                        src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XambV7vLYX2uGTASBtpWt0TwJX9pQ0.png`}
                        alt={`Student ${i + 1}`}
                      />
                      <AvatarFallback>S{i + 1}</AvatarFallback>
                    </Avatar> */}
                    <span>Lorem Ipsum</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        {/* </ScrollArea> */}
      </div>
    </div>
  )
}

