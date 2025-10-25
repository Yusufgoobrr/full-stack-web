"use client";

import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import DarkModeToggle from "@/components/DarkModeToggle";

import Sidebar from "./Sidebar";

type TDashLayout = {
  children: React.ReactNode;
};

const DashLayout = ({ children }: TDashLayout) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowLogoutPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    setShowLogoutPopup(false);
  };

  return (
    <div className="h-screen w-full bg-[#FAFAFA] dark:bg-gray-900 p-2 md:p-4 flex flex-col lg:flex-row lg:space-x-2.5">
      {/* LEFT Sidebar Container */}
      <Sidebar />

      {/* RIGHT Container */}
      <div className="w-full h-full flex flex-col lg:space-y-5 overflow-hidden">
        {/* TOP Banner */}
        <div className="py-3 lg:flex items-center justify-between lg:space-x-6">
          <p className="text-lg md:text-2xl font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
            <span className="font-light">Welcome Back,</span> Mohammed 👋
          </p>

          <div className="hidden lg:flex items-center lg:space-x-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Notification */}
            <div className="flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="w-9 h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg duration-200"
              >
                <div>
                  <BellIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="w-2 h-2 bg-[#BAFC50] rounded-full absolute top-0 right-1" />
              </Link>
              <p className="md:text-lg text-gray-900 dark:text-gray-100">
                Notifications
              </p>
            </div>

            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

            <div
              className="flex items-center space-x-2 relative"
              ref={avatarRef}
            >
              {/* profile Avatar */}
              <button
                onClick={() => setShowLogoutPopup(!showLogoutPopup)}
                className="w-10 h-10 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden hover:scale-105 hover:shadow-lg duration-200 cursor-pointer"
              >
                <Image
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face"
                  alt="Mohammed's Profile"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span class="text-white font-semibold text-sm">M</span>
                        </div>
                      `;
                    }
                  }}
                />
              </button>

              {/* Profile Name */}
              <p className="md:text-lg text-gray-900 dark:text-gray-100">
                Mohammed
              </p>

              {/* Logout Popup */}
              <AnimatePresence>
                {showLogoutPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[120px] z-50"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md duration-200"
                    >
                      <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="h-full w-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-2 md:p-4 overflow-auto scrollbar-hide">
          <div className="max-w-[1400px] mx-auto w-full flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
