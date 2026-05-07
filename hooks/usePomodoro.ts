"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type TimerMode = "WORK" | "SHORT_BREAK" | "LONG_BREAK";

interface PomodoroSettings {
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workTime: 25 * 60,
  shortBreakTime: 5 * 60,
  longBreakTime: 15 * 60,
};

export function usePomodoro(settings = DEFAULT_SETTINGS) {
  const [mode, setMode] = useState<TimerMode>("WORK");
  const [timeLeft, setTimeLeft] = useState(settings.workTime);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    
    switch (newMode) {
      case "WORK":
        setTimeLeft(settings.workTime);
        break;
      case "SHORT_BREAK":
        setTimeLeft(settings.shortBreakTime);
        break;
      case "LONG_BREAK":
        setTimeLeft(settings.longBreakTime);
        break;
    }
  }, [settings]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    switchMode(mode);
  }, [mode, switchMode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      // Auto-switch modes
      if (mode === "WORK") {
        const completed = sessionsCompleted + 1;
        setSessionsCompleted(completed);
        
        if (completed % 4 === 0) {
          switchMode("LONG_BREAK");
        } else {
          switchMode("SHORT_BREAK");
        }
      } else {
        switchMode("WORK");
        setIsActive(true); // Auto-start focus after break finishes
      }
      
      // Notify extension that timer is finished
      window.dispatchEvent(new CustomEvent("FOCUSFORGE_TIMER_FINISHED"));
      
      // Notification sound logic could go here
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {});
      } catch (e) {}
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, sessionsCompleted, switchMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    mode,
    timeLeft,
    isActive,
    sessionsCompleted,
    formatTime: formatTime(timeLeft),
    progress: (1 - timeLeft / (mode === "WORK" ? settings.workTime : mode === "SHORT_BREAK" ? settings.shortBreakTime : settings.longBreakTime)) * 100,
    toggleTimer,
    resetTimer,
    switchMode,
  };
}
