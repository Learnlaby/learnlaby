'use client'

import { useEffect, useState } from "react";
import ClassroomCard from "@/components/ClassroomCard";
import Layout from "@/components/layout";

export default function Home() {
  interface Classroom {
    id: string;
    name: string;
    description?: string;
    image?: string;
  }

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const classroomAPI = "/api/classroom";
  const defaultImage = "https://placehold.co/216x160";

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(classroomAPI);
        if (!response.ok) throw new Error("Failed to fetch classrooms");
        const data = await response.json();
        setClassrooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {loading && <p>Loading classrooms...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && classrooms.length === 0 && <p>No classrooms found.</p>}
        {!loading && !error &&
          classrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              id={classroom.id}
              name={classroom.name}
              description={classroom.description || "No description available"}
              image={classroom.image || defaultImage}
            />
          ))
        }
      </div>
    </Layout>
  );
}
