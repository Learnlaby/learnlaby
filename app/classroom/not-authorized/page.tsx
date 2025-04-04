"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
      <Lock className="w-16 h-16 text-purple-600 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Cannot Access This Classroom
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Either this classroom doesn’t exist, or you’re not a member. Please check the link or contact the instructor for access.
      </p>
      <Button variant="default" onClick={() => router.push("/home")}>
        Back to Home
      </Button>
    </div>
  );
}
