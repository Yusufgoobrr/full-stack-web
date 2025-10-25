"use client";

import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import DarkModeToggle from "@/components/DarkModeToggle";
import { DashboardTabs } from "@/data/dashboard";
import ProductLogo from "@/icons/logos/ProductLogo";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleMenuClick = (tab: any) => {
    if (tab.label === "Settings" || tab.label === "Transactions") {
      alert("This feature is not implemented yet.");
      return;
    }
    // For other menu items, navigate normally
    window.location.href = tab.link;
  };

  const sidebarVariants = {
    hidden: {
      x: "-100%",
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="lg:flex flex-col w-full lg:max-w-xs p-2 md:p-3">
      <div className="flex lg:hidden items-center justify-between">
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            type="button"
            className="rounded-full p-1.5 md:p-2 border text-gray-500 hover:border-black hover:text-black duration-200"
            onClick={() => setIsOpen(true)}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          <ProductLogo className="w-36 md:w-fit" />
        </div>

        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle for Mobile */}
          <DarkModeToggle />

          <Link
            href="/dashboard"
            className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg duration-200"
          >
            <div>
              <BellIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="w-2 h-2 bg-[#BAFC50] rounded-full absolute top-0 right-1" />
          </Link>

          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
              className="w-8 h-8 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden hover:scale-105 hover:shadow-lg duration-200 cursor-pointer"
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
                        <span class="text-white font-semibold text-xs">M</span>
                      </div>
                    `;
                  }
                }}
              />
            </button>

            {/* Logout Popup for Mobile */}
            <AnimatePresence>
              {showLogoutPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[120px] z-50"
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

      {/* SIDEBAR on Mobile */}
      <AnimatePresence>
        {isOpen && (
          <div className="w-full inset-0 h-screen fixed bg-[#00000010] dark:bg-[#00000050] duration-300 overflow-hidden lg:hidden z-50">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              className="flex flex-col space-y-20 w-full max-w-xs p-3 bg-white dark:bg-gray-800 h-full"
            >
              <div className="flex items-center justify-between">
                <ProductLogo />
                <button
                  className="rounded-full p-1 border border-transparent bg-[#BAFC50] hover:bg-transparent hover:border-[#BAFC50] hover:scale-105 duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 flex flex-col">
                {DashboardTabs.map((tab, index) => (
                  <div key={index}>
                    <button
                      onClick={() => handleMenuClick(tab)}
                      className={twMerge(
                        "flex items-center space-x-2 px-3 py-2 md:py-2.5 rounded-full duration-200 w-full text-left",
                        pathname === tab.link
                          ? "bg-white dark:bg-gray-700 text-black dark:text-white"
                          : "text-[#9B9B9B] dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-black dark:hover:text-white",
                      )}
                    >
                      {tab.icon}
                      <p>{tab.label}</p>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="hidden lg:flex mb-20">
        <ProductLogo />
      </div>

      {/* Dashboard TABs on Desktop */}
      <div className="lg:space-y-2 hidden lg:flex flex-col">
        {DashboardTabs.map((tab, index) => (
          <div key={index}>
            <button
              onClick={() => handleMenuClick(tab)}
              className={twMerge(
                "flex items-center space-x-2 px-3 py-2 md:py-2.5 rounded-full duration-200 w-full text-left",
                pathname === tab.link
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white"
                  : "text-[#9B9B9B] dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-black dark:hover:text-white",
              )}
            >
              {tab.icon}
              <p>{tab.label}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
