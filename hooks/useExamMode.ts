"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

interface ExamModeOptions {
  maxWarnings?: number;
  onViolation?: (type: string, count: number) => void;
  onFail?: () => void;
  isActive: boolean;
}

export function useExamMode({ 
  maxWarnings = 3, 
  onViolation, 
  onFail,
  isActive 
}: ExamModeOptions) {
  const [violations, setViolations] = useState(0);

  const triggerViolation = useCallback((type: string) => {
    if (!isActive) return;

    setViolations((prev) => {
      const next = prev + 1;
      
      if (onViolation) onViolation(type, next);

      if (next >= maxWarnings) {
        Swal.fire({
          title: "Exam Terminated",
          text: "You have exceeded the maximum number of integrity violations. This session will be marked as FAILED.",
          icon: "error",
          confirmButtonText: "Exit Session",
          allowOutsideClick: false,
        }).then(() => {
          if (onFail) onFail();
        });
      } else {
        Swal.fire({
          title: "Integrity Warning",
          text: `Suspicious behavior detected: ${type}. Warning ${next}/${maxWarnings}.`,
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
      
      return next;
    });
  }, [isActive, maxWarnings, onViolation, onFail]);

  useEffect(() => {
    if (!isActive) return;

    // 1. Detect Tab Switching / Visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        triggerViolation("Tab Switching");
      }
    };

    // 2. Detect Window Blur (Alt-Tab)
    const handleBlur = () => {
      triggerViolation("Window Focus Lost");
    };

    // 3. Prevent Copy/Paste
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation("Copy/Paste Attempt");
    };

    // 4. Prevent Context Menu (Right Click)
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 5. Detect PrintScreen / Screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "p")) {
        e.preventDefault();
        triggerViolation("Screenshot Attempt");
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("copy", preventCopyPaste);
    window.addEventListener("paste", preventCopyPaste);
    window.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("copy", preventCopyPaste);
      window.removeEventListener("paste", preventCopyPaste);
      window.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, triggerViolation]);

  return { violations };
}
