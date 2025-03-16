"use client";

import React, { useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { SidebarTrigger } from "@/components/ui/sidebar";
import styles from './index.module.css';
import { useSession } from "next-auth/react";
import Image from "next/image";

const AppNavbar = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [classroomData, setClassroomData] = useState({
        name: "",
        image: "",
        description: "",
    });
    const { data: session } = useSession()

    // Toggle for main popup
    const togglePopup = () => { setShowPopup(!showPopup); };
    const closePopup = () => { setShowPopup(false); };

    // Toggle for Create Classroom Modal
    const openCreateModal = () => { setShowCreateModal(true); closePopup(); };
    const closeCreateModal = () => { setShowCreateModal(false); };

    // Toggle Join Classroom Modal
    const openJoinModal = () => { setShowJoinModal(true); closePopup(); };
    const closeJoinModal = () => { setShowJoinModal(false); };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClassroomData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleCreateClassroom = async () => {
        if (!classroomData.name) {
            alert("Classroom name is required!");
            return;
        }

        try {
            const response = await fetch("/api/classroom/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(classroomData),
            });

            if (!response.ok) throw new Error("Failed to create classroom");

            alert("Classroom created successfully!");
            closeCreateModal();
        } catch (error) {
            console.error("Error creating classroom:", error);
            alert("Failed to create classroom");
        }
    };

    // Handle join classroom request
    const handleJoinClassroom = async () => {
        if (!classCode) {
            alert("Class code is required!");
            return;
        }

        try {
            const response = await fetch("/api/classroom/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classroomCode: classCode }),
            });
            console.log(response.json())

            if (!response.ok) throw new Error("Failed to join classroom");
            alert("Successfully joined the classroom!");
            closeJoinModal();
        } catch (error) {
            console.error("Error joining classroom:", error);
            alert("Invalid class code or failed to join.");
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="flex items-center justify-between p-1 bg-white shadow-md w-full text-sm fixed top-0 left-0 z-10">
                {/* Sidebar trigger */}
                <div className="flex items-center gap-1 ml-4">
                    <SidebarTrigger>
                        <button className="p-1 rounded-full hover:bg-gray-200">
                            <FaBars className={styles.faplusIcon} />
                        </button>
                    </SidebarTrigger>
                </div>

                {/* App name */}
                <div className="flex-grow text-center md:ml-60">
                    <b className={styles.learnlabyLogo}>Learnlaby</b>
                </div>

                {/* Profile + Popup Menu */}
                <div className="flex items-center gap-1 mr-4 relative">
                    <button className="p-1 rounded-full hover:bg-gray-200" onClick={togglePopup}>
                        <FaPlus className={styles.faplusIcon} />
                    </button>

                    {showPopup && (
                        <div className="absolute right-0 top-10 bg-white shadow-md rounded-lg w-40 p-2 z-20">
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
                                onClick={openJoinModal}>Join Class
                            </button>
                            <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded-md"
                                onClick={openCreateModal}>Create Class
                            </button>
                        </div>
                    )}

                    <button className="p-1 rounded-full hover:bg-gray-200">
                        <a href="/profile">
                            {session && session.user && (
                                <Image
                                    src={session.user.image || "/default-profile.png"}
                                    alt={session.user.name || "User profile"}
                                    className="rounded-full w-8 h-8"
                                    width={80}
                                    height={80}
                                />
                            )}
                        </a>
                    </button>
                </div>
            </nav>

            {/* Create Classroom Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Create Classroom</h2>

                        <label className="block mb-2">Classroom Name</label>
                        <input
                            type="text"
                            name="name"
                            value={classroomData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3"
                            placeholder="Enter classroom name"
                        />

                        <label className="block mb-2">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={classroomData.image}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3"
                            placeholder="Enter image URL"
                        />

                        <label className="block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={classroomData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3"
                            placeholder="Enter description"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={closeCreateModal}>Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                onClick={handleCreateClassroom}>Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showJoinModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Join Classroom</h2>

                        <label className="block mb-2">Enter Class Code</label>
                        <input
                            type="text"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mb-3"
                            placeholder="Enter class code"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={closeJoinModal}>Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                                onClick={handleJoinClassroom}>Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppNavbar;
