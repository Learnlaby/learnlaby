import React from "react";
import { FaPlus, FaBars } from "react-icons/fa";
import styles from './index.module.css';

const AppNavbar = () => {
    return (
        <nav className="flex items-center justify-between p-1 bg-white shadow-md">
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-200">
                    <FaBars className={styles.fabarsIcon} />
                </button>
                <b className={styles.learnlabyLogo}>Learnlaby</b>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-200">
                    <FaPlus className={styles.faplusIcon} />
                </button>
                <div className="w-10 h-10 rounded-full bg-purple-300"></div> {/* Profile Image Placeholder */}
            </div>
        </nav>
    );
};

export default AppNavbar;
