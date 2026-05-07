"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface FocusEnforcementProps {
  isActive: boolean;
  isStrictMode: boolean;
  onViolation?: () => void;
}

export function useFocusEnforcement({ isActive, isStrictMode, onViolation }: FocusEnforcementProps) {
  const [isTabFocused, setIsTabFocused] = useState(true);

  useEffect(() => {
    // Notify the Chrome Extension (if installed)
    const isFocusActive = isActive && isStrictMode;
    window.dispatchEvent(new CustomEvent("FOCUSFORGE_TIMER_STATE", {
      detail: { active: isFocusActive }
    }));

    if (!isActive || !isStrictMode) {
      setIsTabFocused(true);
      return;
    }

    const handleBlur = () => {
      setIsTabFocused(false);
      
      Swal.fire({
        title: "Focus Interrupted!",
        text: "You've left the focus zone. Return immediately to maintain your streak!",
        icon: "warning",
        confirmButtonText: "I'm Back",
        confirmButtonColor: "var(--color-secondary)",
        background: "var(--color-card)",
        color: "var(--color-primary)",
        allowOutsideClick: false,
        backdrop: `rgba(15, 23, 42, 0.9) blur(10px)`
      }).then((result) => {
        if (result.isConfirmed) {
          setIsTabFocused(true);
        }
      });

      if (onViolation) onViolation();
    };

    const handleFocus = () => {
      // Logic for when they return if needed
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isActive, isStrictMode, onViolation]);

  return { isTabFocused };
}
