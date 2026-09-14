"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isDesktopExpanded: boolean;
  toggleDesktop: () => void;
  isMounted: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved state from localStorage after initial mount
  useEffect(() => {
    const saved = localStorage.getItem("dinosaku-sidebar-expanded");
    if (saved !== null) {
      setIsDesktopExpanded(saved === "true");
    }
    // Delay transition enabling to prevent hydration flash
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const toggleMobile = () => setIsOpen((prev) => !prev);
  
  const toggleDesktop = () => {
    setIsDesktopExpanded((prev) => {
      const newState = !prev;
      localStorage.setItem("dinosaku-sidebar-expanded", String(newState));
      return newState;
    });
  };

  return (
    <SidebarContext.Provider 
      value={{ 
        isOpen, 
        setIsOpen, 
        toggleMobile, 
        isDesktopExpanded, 
        toggleDesktop,
        isMounted
      }}
    >
      <div 
        style={{ 
          visibility: isMounted ? "visible" : "hidden",
          display: "contents" 
        }}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
