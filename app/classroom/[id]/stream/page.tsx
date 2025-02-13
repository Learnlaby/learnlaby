'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Classroom {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

const StreamPage = () => {
  const params = useParams(); // Get route parameters
  const id = params?.id as string; // Extract 'id' safely
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/classroom/${id}`);
        if (!response.ok) throw new Error("Failed to fetch classroom data");

        const data: Classroom = await response.json();
        setClassroom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!classroom) return <p>Classroom not found</p>;

  return (
    <div className="p-4">
      <div className="mt-4">
        <Image 
          src={classroom.image || "https://placehold.co/216x160"} 
          alt="Classroom Image" 
          width={216} 
          height={160} 
        />
      </div>
      <h1 className="text-2xl font-bold">{classroom.name}</h1>
      <p className="text-gray-700">{classroom.description || "No description available"}</p>
    </div>
  );
}

export default StreamPage;
