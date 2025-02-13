"use client";

import React, { useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { SidebarTrigger } from "@/components/ui/sidebar";
import styles from './index.module.css';

const AppNavbar = () => {
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => { setShowPopup(!showPopup); };
    const closePopup = () => { setShowPopup(false); };
    
    return (
        <nav className="flex items-center justify-between p-1 bg-white shadow-md w-full text-sm fixed top-0 left-0 z-10">
            {/* Sidebar trigger section */}
            <div className="flex items-center gap-1 ml-4">
                <SidebarTrigger>
                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <FaBars className={styles.faplusIcon} />
                    </button>
                </SidebarTrigger>
            </div>

            {/* App name section */}
            <div className="flex-grow text-center md:ml-60">
                <b className={styles.learnlabyLogo}>Learnlaby</b>
            </div>

            {/* Profile icon section */}
            <div className="flex items-center gap-1 mr-4 relative">
                <button className="p-1 rounded-full hover:bg-gray-200" onClick={togglePopup}>
                    <FaPlus className={styles.faplusIcon} />
                </button>
                {showPopup && (
                    <div className="absolute right-0 top-10 bg-white shadow-md rounded-lg w-40 p-2 z-20">
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
                            onClick={() => { closePopup(); }}>Join Class
                        </button>
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
                            onClick={() => { closePopup(); }}>Create Class
                        </button>
                    </div>
                )}
                <button className="p-1 rounded-full hover:bg-gray-200">
                    <div className="w-8 h-8 rounded-full bg-purple-300"></div>
                </button>
            </div>
        </nav>
    );
};

export default AppNavbar;
