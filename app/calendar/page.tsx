"use client";

import Layout from "@/components/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


type SessionUser = {
  name?: string;
  email?: string;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect user to home page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // If the user is not authenticated, render nothing
  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const user: SessionUser = session.user;
  const userEmail = user.email!;
  const encodedEmail = encodeURIComponent(userEmail);

  return (
    <Layout>
      {/* Wrap inside Layout for Navbar & Sidebar */}
      <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
        <h1
          className="profile-title"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          {user.name || "Your"}'s Calendar
        </h1>

        {/* Display Google Calendar if authenticated */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <iframe
            src={`https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FBangkok
              &showPrint=0
              &showTz=0
              &color=%23039BE5
              &src=${encodedEmail}`}
            width="100%"
            height="600"
            style={{ border: "0", borderRadius: "10px" }}
            allowFullScreen
          />
        </div>
      </div>
    </Layout>
  );
}
