'use client'

import React, { useEffect, useState } from "react";
import { FaHome, FaCalendar, FaClipboardList, FaBook } from "react-icons/fa";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import styles from './index.module.css';
import Image from "next/image";

// Menu items: Home, Calendar, Registered, To-Do List
const items = [
  { title: "Home", url: "/home", icon: FaHome },
  { title: "Calendar", url: "#", icon: FaCalendar },
  { title: "Registered", url: "#", icon: FaBook },
  { title: "To Do List", url: "#", icon: FaClipboardList },
];

// Classroom interface
interface Classroom {
  id: string;
  image: string;
  name: string;
}

export function AppSidebar() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch("/api/classroom");
        if (!response.ok) throw new Error("Failed to fetch classrooms");

        const data: Classroom[] = await response.json();
        setClassrooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Application Section */}
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="pl-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar_item">
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className={styles.icon} />
                      <span className={styles.text}>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          <div className="mt-6" />
          {/* Classes Section */}
          <SidebarGroupLabel>Classes</SidebarGroupLabel>
          <SidebarGroupContent className="pl-3">
            <div className="space-y-2">
              {loading ? (
                <p>Loading classes...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : classrooms.length === 0 ? (
                <p className="text-gray-500">No joined classes</p>
              ) : (
                classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="flex items-center gap-3 p-0.5 rounded-lg"
                  >
                    <Image
                        src={classroom.image || "https://placehold.co/10x10"}
                        alt={classroom.name || "Classroom profile"}
                        className="rounded-full w-7 h-7"
                        width={80}
                        height={80}
                    />
                    <a href={`/classroom/${classroom.id}/stream`} className="textColor">
                      {classroom.name}
                    </a>
                  </div>
                ))
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
