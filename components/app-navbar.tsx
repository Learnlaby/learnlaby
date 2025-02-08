import React from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { SidebarTrigger } from "@/components/ui/sidebar";
import styles from './index.module.css';

const AppNavbar = () => {
    return (
        <nav className="flex items-center justify-between p-2 bg-white shadow-md w-full text-sm fixed top-0 left-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger>
                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <FaBars className={styles.faplusIcon} />
                    </button>
                </SidebarTrigger>
                <b className={styles.learnlabyLogo}>Learnlaby</b>
            </div>

            <div className="flex items-center gap-1">
                <button className="p-1 rounded-full hover:bg-gray-200">
                    <FaPlus className={styles.faplusIcon} />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-200">
                    <div className="w-8 h-8 rounded-full bg-purple-300"></div>
                </button>
            </div>
        </nav>
    );
};

export default AppNavbar;
