"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React from "react";

import { useDarkMode } from "@/contexts/DarkModeContext";

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode();

  const handleToggle = () => {
    toggleDarkMode();
  };

  if (!isLoaded) {
    return (
      <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="w-9 h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center relative hover:scale-105 hover:shadow-lg duration-200 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {isDarkMode ? (
          <SunIcon className="w-4 h-4 text-yellow-500" />
        ) : (
          <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
