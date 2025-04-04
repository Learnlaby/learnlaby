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

    const { invitationId, action } = await req.json();

    if (!invitationId || !["accept", "decline"].includes(action)) {
      return new Response("Invalid request", { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return new Response("Invitation not found", { status: 404 });
    }

    if (invitation.receiverEmail !== session.user.email) {
      return new Response("Forbidden", { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    if (action === "accept") {
      const existingMember = await prisma.classroomMember.findFirst({
        where: {
          userId: user.id,
          classroomId: invitation.classroomId,
        },
      });

      if (!existingMember) {
        await prisma.classroomMember.create({
          data: {
            userId: user.id,
            classroomId: invitation.classroomId,
            role: invitation.role,
          },
        });
      }

      // Calendar logic here
      const classroom = await prisma.classroom.findUnique({
        where: { id: invitation.classroomId },
        include: { timeSlots: true },
      });

      if (!classroom) {
        return new Response("Classroom not found", { status: 404 });
      }

      const googleAccount = await prisma.account.findFirst({
        where: { userId: user.id, provider: "google" },
        select: { access_token: true },
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
        const startDateTime = `${firstDay.toISOString().split("T")[0]}T${slot.startTime}:00+07:00`;
        const endDateTime = `${firstDay.toISOString().split("T")[0]}T${slot.endTime}:00+07:00`;

        const recurrenceRule = `RRULE:FREQ=WEEKLY;UNTIL=${courseEnd.toISOString().replace(/[-:]/g, "").split(".")[0]}Z;BYDAY=${byDay}`;

        const event = {
          summary: `Class: ${classroom.name}`,
          description: `Class schedule for ${classroom.name}`,
          start: {
            dateTime: startDateTime,
            timeZone: "Asia/Bangkok",
          },
          end: {
            dateTime: endDateTime,
            timeZone: "Asia/Bangkok",
          },
          recurrence: [recurrenceRule],
        };

        return fetch(googleCalendarApiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleAccount.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });
      });

      const results = await Promise.all(eventRequests.filter(Boolean));
      const allSuccess = results.every((res) => res && res.ok);

      await prisma.invitation.delete({
        where: { id: invitation.id },
      });

      return new Response(
        allSuccess ? "Invitation accepted and calendar events created" : "Invitation accepted but some calendar events failed",
        { status: allSuccess ? 200 : 207 }
      );
    }

    if (action === "decline") {
      await prisma.invitation.delete({
        where: { id: invitation.id },
      });

      return new Response("Invitation declined", { status: 200 });
    }

    return new Response("Unhandled action", { status: 400 });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
