"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send } from 'lucide-react';

import {
  ANNOUNCEMENT_API,
  COMMENT_ON_POST_API,
  CLASSROOM_BY_ID_API,
  POST_API,
  DEFAULT_IMAGE,
} from "@/lib/api_routes";

interface Classroom {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface User {
  id: string;
  name?: string;
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  type: string;
  author: {
    name?: string;
  };
  comments?: Comment[];
}

const StreamPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for post creation
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for comments
  const [commentContents, setCommentContents] = useState<{[postId: string]: string}>({});
  const [submittingComments, setSubmittingComments] = useState<{[postId: string]: boolean}>({});

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) return;

      try {
        const response = await fetch(CLASSROOM_BY_ID_API.replace("[id]", id));
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
        const response = await fetch(POST_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId: id }),
        });

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data: Post[] = await response.json();
        
        // Initialize an empty comments array for each post
        const postsWithComments = await Promise.all(data.map(async (post) => {
          const comments = await fetchComments(post.id);
          return { ...post, comments };
        }));
        
        setPosts(postsWithComments);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchClassroom(), fetchClassroomPosts()])
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`${COMMENT_ON_POST_API}?postId=${postId}`);
      if (!response.ok) {
        console.error("Failed to fetch comments for post", postId);
        return [];
      }
      return await response.json();
    } catch (err) {
      console.error("Error fetching comments:", err);
      return [];
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(ANNOUNCEMENT_API, {
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
      newPost.comments = []; // Initialize empty comments array
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent(""); // Clear the input field
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentChange = (postId: string, content: string) => {
    setCommentContents(prev => ({
      ...prev,
      [postId]: content
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentContents[postId];
    if (!content?.trim()) return;
  
    setSubmittingComments(prev => ({
      ...prev,
      [postId]: true
    }));
  
    try {
      const response = await fetch(COMMENT_ON_POST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) throw new Error("Failed to create comment");

      const newComment: Comment = await response.json();
      
      // Update the posts state with the new comment
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), newComment]
            };
          }
          return post;
        })
      );

      // Clear the comment input for this post
      setCommentContents(prev => ({
        ...prev,
        [postId]: ""
      }));
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComments(prev => ({
        ...prev,
        [postId]: false
      }));
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
          src={classroom.image || DEFAULT_IMAGE}
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
      <div className="px-10 py-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Create an Announcement</h2>
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="w-full p-3 border rounded-lg"
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:bg-gray-300"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Section */}
      <div className="px-10 py-4">
        <h2 className="text-xl font-semibold mb-4">Announcements</h2>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-6 shadow-md bg-white">
                <h3 className="text-lg font-semibold">{post.author?.name || "You"}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="mt-3 text-gray-800">{post.content}</p>
                
                <Separator className="mt-5 bg-gray-300" />

                {/* Comment Section */}
                <div className="mt-4 rounded-lg">
                  <h4 className="text-md font-semibold mb-2">Comments</h4>
                  
                  {/* Display comments */}
                  <div className="space-y-3 mb-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            {comment.user.image && (
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image 
                                  src={comment.user.image}
                                  alt={comment.user.name || "User"}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{comment.user.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                  </div>
                  
                  {/* Add new comment */}
                  <div className="flex items-center space-x-2">
                    <textarea
                      className="w-full h-10 border rounded-2xl bg-white placeholder:text-gray-400 pl-3 pt-2"
                      placeholder="Add your comment"
                      value={commentContents[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleCommentSubmit(post.id);
                        }
                      }}
                    />
                    <button
                      className="px-2 py-2 bg-white hover:bg-gray-100 rounded-full text-purple-500 disabled:text-gray-300"
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={submittingComments[post.id] || !commentContents[post.id]?.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
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