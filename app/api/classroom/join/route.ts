import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // Get user session
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new Response("Unauthorized", { status: 401 });
        }

        // Extract the classroom code from request body
        const { classroomCode } = await req.json();

        if (!classroomCode) {
            return new Response("Classroom code is required", { status: 400 });
        }

        // Find the logged-in user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, email: true }
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Find the classroom by code
        const classroom = await prisma.classroom.findUnique({
            where: { code: classroomCode },
            select: { id: true }
        });

        if (!classroom) {
            return new Response("Invalid classroom code", { status: 404 });
        }

        // Check if the user is already a member
        const existingMember = await prisma.classroomMember.findFirst({
            where: {
                classroomId: classroom.id,
                userId: user.id
            }
        });

        if (existingMember) {
            return new Response("User is already a member of this classroom", { status: 400 });
        }

        // Create a new ClassroomMember entry with role "student"
        await prisma.classroomMember.create({
            data: {
                classroomId: classroom.id,
                userId: user.id,
                role: "student"
            }
        });

        // Retrieve Google access token from Account table where provider is Google
        const googleAccount = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: "google"
            },
            select: { access_token: true }
        });

        if (!googleAccount?.access_token) {
            return new Response("Google account access token not found", { status: 401 });
        }

        // Use "primary" as the calendar ID
        const googleCalendarApiUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

        // const event = {
        //     summary: `New Student Joined: ${session.user.email}`,
        //     description: `User ${session.user.email} has joined the classroom.`,
        //     start: {
        //         dateTime: new Date().toISOString(), // Current time
        //         timeZone: "UTC"
        //     },
        //     end: {
        //         dateTime: new Date(new Date().getTime() + 3600000).toISOString(), // +1 hour
        //         timeZone: "UTC"
        //     }
        // };

        // Fixed event times in UTC+7 (Asia/Bangkok)

        const startDateTime = new Date("2025-03-18T09:00:00+07:00").toISOString();

        const endDateTime = new Date("2025-03-20T12:00:00+07:00").toISOString();
        
        
        // Function to get the current time in UTC+7 (Indochina Time)
        function getUTC7TimeOffset(hoursOffset = 0) {
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 7 + hoursOffset);
            return now.toISOString();
        }

        const event = {
            summary: `New Student Joined: ${session.user.email}`,
            description: `User ${session.user.email} has joined the classroom.`,
            start: {
                // dateTime: getUTC7TimeOffset(), // Current time in UTC+7
                dateTime: startDateTime,
                timeZone: "Asia/Bangkok" // UTC+7 timezone
            },
            end: {
                // dateTime: getUTC7TimeOffset(1), // +1 hour in UTC+7
                dateTime: endDateTime, // +1 hour in UTC+7
                timeZone: "Asia/Bangkok"
            },
            recurrence: [
                "RRULE:FREQ=WEEKLY;COUNT=2"
            ]
        };

        // Send the event to Google Calendar API
        const googleApiResponse = await fetch(googleCalendarApiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${googleAccount.access_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)
        });
        console.log(googleApiResponse)
        if (!googleApiResponse.ok) {
            console.error("Failed to add event to Google Calendar:", await googleApiResponse.text());
            return new Response("Failed to add event to Google Calendar", { status: 500 });
        }

        return new Response("User successfully joined the classroom and event added to calendar", { status: 201 });

    } catch (error) {
        console.error("Error joining classroom:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
