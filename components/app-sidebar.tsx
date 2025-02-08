import React from "react";
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

// Menu items. Home, calendar, registered, to do list, and classes
const items = [
  {
    title: "Home",
    url: "#",
    icon: FaHome,
  },
  {
    title: "Calendar",
    url: "#",
    icon: FaCalendar,
  },
  {
    title: "Registered",
    url: "#",
    icon: FaBook,
  },
  {
    title: "To Do List",
    url: "#",
    icon: FaClipboardList,
  },
];

export function AppSidebar() {
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
              {["Class A", "Class B", "Class C", "Class D"].map((className) => (
                <div key={className} className="flex items-center gap-3 p-0.5 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-purple-300"></div>
                  <span className="textColor">{className}</span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
