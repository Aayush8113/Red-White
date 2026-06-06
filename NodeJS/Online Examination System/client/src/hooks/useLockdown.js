import { useEffect } from "react";

export function useLockdown({ onViolation }) {
  useEffect(() => {
    
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          onViolation("Fullscreen Blocked");
        });
      }
    };

    
    const handleContextMenu = (e) => {
      e.preventDefault();
      onViolation("Right Click Attempted");
    };

    
    const handleCopy = (e) => {
      e.preventDefault();
      onViolation("Copy Attempted");
    };
    const handlePaste = (e) => {
      e.preventDefault();
      onViolation("Paste Attempted");
    };

    
    const handleVisibility = () => {
      if (document.hidden) {
        onViolation("Tab Switch / Window Minimized");
      }
    };

    
    const handleBlur = () => {
      onViolation("Window Focus Lost");
    };

    
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "u" || e.key === "s" || e.key === "p")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        onViolation(`Forbidden Shortcut: ${e.key}`);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("paste", handlePaste);
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);

    
    enterFullscreen();

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onViolation]);

  return {
    forceFullscreen: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }
  };
}
