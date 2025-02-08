import React from "react";
import { FaHome, FaCalendar, FaClipboardList, FaBook } from "react-icons/fa";
import styles from './index.module.css';
import { Separator } from "@/components/ui/separator"

const AppSidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-4 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <ul className="space-y-4">
        <li className={`flex items-center gap-2 p-2 bg-gray-100 ${styles.sidebarItem}`}>
          <FaHome className={styles.iconColor} /> <span className={styles.textColor}>Home</span>
        </li>
        <li className={`flex items-center gap-2 p-2 rounded-lg ${styles.sidebarItem}`}>
          <FaCalendar className={styles.iconColor} /> <span className={styles.textColor}>Calendar</span>
        </li>

        <Separator className="border-t border-gray-300 my-2"/>

        <li className={`flex items-center gap-2 p-2 rounded-lg ${styles.sidebarItem}`}>
          <FaBook className={styles.iconColor} /> <span className={styles.textColor}>Registered</span>
        </li>
        <li className={`flex items-center gap-2 p-2 rounded-lg ${styles.sidebarItem}`}>
          <FaClipboardList className={styles.iconColor} /> <span className={styles.textColor}>To Do List</span>
        </li>
      </ul>

      <div className="mt-8 space-y-2">
        {["Class A", "Class B", "Class C", "Class D"].map((className) => (
          <div key={className} className={`flex items-center gap-2 p-2 rounded-lg ${styles.sidebarItem}`}>
            <div className="w-8 h-8 rounded-full bg-purple-300"></div>
            <span className={styles.textColor}>{className}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AppSidebar;
