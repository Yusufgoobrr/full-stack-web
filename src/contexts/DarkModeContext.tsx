"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoaded: boolean;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

type DarkModeProviderProps = {
  children: React.ReactNode;
};

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    // Apply dark mode immediately to prevent flash
    const applyTheme = (theme: boolean) => {
      const htmlElement = document.documentElement;
      if (theme) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    };

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      const parsedTheme = JSON.parse(savedTheme);
      setIsDarkMode(parsedTheme);
      applyTheme(parsedTheme);
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark);
    }
    setIsLoaded(true);
  }, []);

  // Apply dark mode class to document when isDarkMode changes
  useEffect(() => {
    if (isLoaded) {
      const htmlElement = document.documentElement;

      if (isDarkMode) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }

      // Save preference to localStorage
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }
  }, [isDarkMode, isLoaded]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isLoaded }}>
      {children}
    </DarkModeContext.Provider>
  );
};
