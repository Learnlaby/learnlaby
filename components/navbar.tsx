import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from './index.module.css';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <b className={styles.learnlabylogo}>Learnlaby</b>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <FaPlus />
        </button>
        <div className="w-10 h-10 rounded-full bg-purple-300"></div> {/* Profile Image Placeholder */}
      </div>
    </nav>
  );
};

export default Navbar;
