import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { classroomCode } = await req.json();
    if (!classroomCode) {
      return new Response("Classroom code is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true }
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const classroom = await prisma.classroom.findUnique({
      where: { code: classroomCode },
      include: { timeSlots: true },
    });

    if (!classroom) {
      return new Response("Invalid classroom code", { status: 404 });
    }

    const existingMember = await prisma.classroomMember.findFirst({
      where: { classroomId: classroom.id, userId: user.id }
    });

    if (existingMember) {
      return new Response("User is already a member of this classroom", { status: 400 });
    }

    await prisma.classroomMember.create({
      data: {
        classroomId: classroom.id,
        userId: user.id,
        role: "student"
      }
    });

    const googleAccount = await prisma.account.findFirst({
      where: { userId: user.id, provider: "google" },
      select: { access_token: true }
    });

    if (!googleAccount?.access_token) {
      return new Response("Google account access token not found", { status: 401 });
    }

    const googleCalendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

    const dayMap: Record<string, string> = {
      Monday: "MO",
      Tuesday: "TU",
      Wednesday: "WE",
      Thursday: "TH",
      Friday: "FR",
      Saturday: "SA",
      Sunday: "SU",
    };

    const eventRequests = classroom.timeSlots.map((slot) => {
      const byDay = dayMap[slot.day];
      if (!byDay) return null;

      const courseStart = new Date(classroom.startDate);
      const courseEnd = new Date(classroom.endDate);

      const getFirstOccurrence = (start: Date, targetDay: string) => {
        const targetDayNum = new Date(`${targetDay}, 01 Jan 2001`).getDay();
        const result = new Date(start);
        while (result.getDay() !== targetDayNum) {
          result.setDate(result.getDate() + 1);
        }
        return result;
      };

      const firstDay = getFirstOccurrence(courseStart, slot.day);
      const startDateTime = `${firstDay.toISOString().split('T')[0]}T${slot.startTime}:00+07:00`;
      const endDateTime = `${firstDay.toISOString().split('T')[0]}T${slot.endTime}:00+07:00`;

      const recurrenceRule = `RRULE:FREQ=WEEKLY;UNTIL=${courseEnd.toISOString().replace(/[-:]/g, '').split('.')[0]}Z;BYDAY=${byDay}`;

      const event = {
        summary: `Class: ${classroom.name}`,
        description: `Class schedule for ${classroom.name}`,
        start: {
          dateTime: startDateTime,
          timeZone: "Asia/Bangkok"
        },
        end: {
          dateTime: endDateTime,
          timeZone: "Asia/Bangkok"
        },
        recurrence: [recurrenceRule]
      };

      return fetch(googleCalendarApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccount.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      });
    });

    const results = await Promise.all(eventRequests.filter(Boolean));

    const allSuccess = results.every((res) => res && res.ok);
    if (!allSuccess) {
      return new Response("Some calendar events failed", { status: 207 });
    }

    return new Response("Joined and calendar events created", { status: 201 });

  } catch (error) {
    console.error("Error joining classroom:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
