"use client";
import React, { createContext, useContext, useState } from "react";

export type GamificationState = {
  totalPoints: number;
  currentStreak: number;
  energy: number;
};

const GamificationContext = createContext<{
  gamification: GamificationState;
  addPoints: (points: number) => void;
  setGamification: (g: GamificationState) => void;
} | null>(null);

export function GamificationProvider({
  initialState,
  children,
}: {
  initialState: GamificationState;
  children: React.ReactNode;
}) {
  const [gamification, setGamification] = useState<GamificationState>(initialState);

  const addPoints = (points: number) => {
    setGamification((prev) => ({ ...prev, totalPoints: prev.totalPoints + points }));
  };

  return (
    <GamificationContext.Provider value={{ gamification, addPoints, setGamification }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
