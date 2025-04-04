"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Classroom {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  type: string;
  author: {
    name?: string;
  };
}

const StreamPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      }
    };

    const fetchClassroomPosts = async () => {
      if (!id) return;

      try {
        const response = await fetch("/api/classroom/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId: id }),
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchClassroom(), fetchClassroomPosts()])
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/classroom/posts/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classroomId: id,
          content: newPostContent,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost: Post = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent(""); // Clear the input field
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!classroom) return <p>Classroom not found</p>;

  return (
    <div className="relative min-h-screen">
      {/* Image Container */}
      <div className="relative w-full h-[30vh]">
        <Image
          src={classroom.image || "https://placehold.co/800x400"}
          alt="Classroom Image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Classroom Info */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-bold">{classroom.name}</h1>
        <p className="text-gray-700">{classroom.description || "No description available"}</p>
      </div>

      {/* Create Post Section */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <form onSubmit={handlePostSubmit}>
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={4}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      {/* Announcements Section */}
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold mb-4">Announcements</h2>
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold">{post.author?.name || "You"}</h3>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="mt-2 text-gray-800">{post.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No announcements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
