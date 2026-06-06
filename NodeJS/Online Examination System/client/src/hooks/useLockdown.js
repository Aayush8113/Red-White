import { useEffect } from "react";

export function useLockdown({ onViolation }) {
  useEffect(() => {
    // 1. Force Fullscreen
    const enterFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          onViolation("Fullscreen Blocked");
        });
      }
    };

    // 2. Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      onViolation("Right Click Attempted");
    };

    // 3. Disable Copy/Paste
    const handleCopy = (e) => {
      e.preventDefault();
      onViolation("Copy Attempted");
    };
    const handlePaste = (e) => {
      e.preventDefault();
      onViolation("Paste Attempted");
    };

    // 4. Detect Tab Switch (Visibility API)
    const handleVisibility = () => {
      if (document.hidden) {
        onViolation("Tab Switch / Window Minimized");
      }
    };

    // 5. Detect Blur (Window focus loss)
    const handleBlur = () => {
      onViolation("Window Focus Lost");
    };

    // 6. Disable Common Shortcuts (Ctrl+C, Ctrl+V, F12, etc.)
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

    // Prompt for fullscreen on mount
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
