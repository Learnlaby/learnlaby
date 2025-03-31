"use client";

import React, { useState } from "react";
import { FaBars, FaPlus, FaTrash } from "react-icons/fa";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from './index.module.css';
import { useSession } from "next-auth/react";
import Image from "next/image";

// the timeslot type
type TimeSlot = {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
};

const AppNavbar = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [classCode, setClassCode] = useState("");
    const [classroomData, setClassroomData] = useState({
        name: "",
        image: "",
        description: "",
        startDate: "",
        endDate: "",
    });
    
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot>({
        id: "",
        day: "Monday",
        startTime: "",
        endTime: "",
    });
    
    const { data: session } = useSession()
    const router = useRouter();

    // Toggle for main popup
    const togglePopup = () => { setShowPopup(!showPopup); };
    const closePopup = () => { setShowPopup(false); };

    // Toggle for Create Classroom Modal
    const openCreateModal = () => { 
        setShowCreateModal(true); 
        closePopup(); 
        setTimeSlots([]);  // reset time slots when opening modal
    };
    
    const closeCreateModal = () => { 
        setShowCreateModal(false); 
        setClassroomData({ // reset form data
            name: "",
            image: "",
            description: "",
            startDate: "",
            endDate: "",
        });
        setTimeSlots([]);
    };

    // Toggle Join Classroom Modal
    const openJoinModal = () => { setShowJoinModal(true); closePopup(); };
    const closeJoinModal = () => { setShowJoinModal(false); };

    // Handle form input changes for classroom data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClassroomData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle time slot input changes
    const handleTimeSlotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentTimeSlot((prev) => ({ ...prev, [name]: value }));
    };

    // Add a time slot
    const addTimeSlot = () => {
        if (!currentTimeSlot.day || !currentTimeSlot.startTime || !currentTimeSlot.endTime) {
            alert("Please fill in all time slot fields!");
            return;
        }

        if (currentTimeSlot.startTime >= currentTimeSlot.endTime) {
            alert("Start time must be before end time!");
            return;
        }

        const newTimeSlot = { // Create a new time slot with unique ID
            ...currentTimeSlot,
            id: Date.now().toString(),
        };

        setTimeSlots([...timeSlots, newTimeSlot]);
        
        // reset current time slot form
        setCurrentTimeSlot({
            id: "",
            day: "Monday",
            startTime: "",
            endTime: "",
        });
    };

    // remove a time slot
    const removeTimeSlot = (id: string) => {
        setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    };

    // Handle form submission
    const handleCreateClassroom = async () => {
        if (!classroomData.name) {
            alert("Classroom name is required!");
            return;
        }

        // if course duration is not set, alert the user
        

        if (!classroomData.startDate || !classroomData.endDate) {
            alert("Course start and end dates are required!");
            return;
        }

        if (timeSlots.length === 0) {
            alert("At least one time slot is required!");
            return;
        }

        try {
            const dataToSubmit = {
                ...classroomData,
                timeSlots,
            };

            const response = await fetch("/api/classroom/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit),
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

            if (!response.ok) throw new Error("Failed to join classroom");

            alert("Successfully joined the classroom!");
            closeJoinModal();
        } catch (error) {
            console.error("Error joining classroom:", error);
            alert("Invalid class code or failed to join.");
        }
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
          await signOut({ redirect: false })
          router.replace("http://localhost:3000/") // redirect to sign-in page
        }
    };

    const formatTimeSlot = (slot: TimeSlot) => {
        return `${slot.day}: ${slot.startTime} - ${slot.endTime}`;
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-gray-200">
                            {session?.user && (
                                <Image
                                src={session.user.image || "/default-profile.png"}
                                alt={session.user.name || "User profile"}
                                className="rounded-full w-8 h-8"
                                width={80}
                                height={80}
                                />
                            )}
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-60 mr-4">
                            <DropdownMenuLabel className="font-medium text-base">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="text-black">
                                {session?.user?.name || "Unknown User"}
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled className="text-black">
                                {session?.user?.email || "No Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-500 cursor-pointer"
                            >
                            Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {/* Create Classroom Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-4">Create Classroom</h2>

                        {/* Basic Course Information */}
                        <label className="block mb-2">Classroom Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={classroomData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                            placeholder="Enter classroom name"
                            required
                        />

                        <label className="block mb-2">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={classroomData.image}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                            placeholder="Enter image URL"
                        />

                        <label className="block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={classroomData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                            placeholder="Enter description"
                            rows={3}
                        />

                        {/* Course Schedule */}
                        <label className="block mb-2 mt-3 text-lg font-semibold">Course Duration</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block mb-2">Start Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={classroomData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block mb-2">End Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={classroomData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Time Slots*/}
                        <label className="block mb-2 font-medium">Time Slots <span className="text-red-500">*</span></label>
                        
                        {/* Current time slots display */}
                        {timeSlots.length > 0 && (
                            <div className="mb-3">
                                <ul className="space-y-2">
                                    {timeSlots.map(slot => (
                                        <li key={slot.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span>{formatTimeSlot(slot)}</span>
                                            <button 
                                                onClick={() => removeTimeSlot(slot.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Add new time slot form*/}
                        <div className="flex items-end gap-2 mb-4">
                            <div className="flex-1">
                                <label className="block mb-1 text-sm">Day</label>
                                <select
                                    name="day"
                                    value={currentTimeSlot.day}
                                    onChange={handleTimeSlotChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                >
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 text-sm">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={currentTimeSlot.startTime}
                                    onChange={handleTimeSlotChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="Start Time"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 text-sm">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={currentTimeSlot.endTime}
                                    onChange={handleTimeSlotChange}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="End Time"
                                />
                            </div>
                            <div>
                                <button
                                    className="pb-3 text-gray-500 rounded-md hover:text-gray-700"
                                    onClick={addTimeSlot}
                                    title="Add Time Slot"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-10">
                            <button
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white"
                                onClick={closeCreateModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
                                onClick={handleCreateClassroom}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Classroom Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Join Classroom</h2>

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
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white rounded-md"
                                onClick={closeJoinModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
                                onClick={handleJoinClassroom}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppNavbar;