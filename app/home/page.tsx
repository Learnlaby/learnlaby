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

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch("/api/classroom");
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
      <div className="classroom-card-container">
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
              image={classroom.image || "https://placehold.co/216x160"}
            />
          ))
        }
      </div>
    </Layout>
  );
}
