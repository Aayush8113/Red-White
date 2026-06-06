import { useEffect, useRef, useState } from "react";

import { apiFetch } from "../lib/api";

export function useExamIntegrity({ attemptId, token, onAutoSubmit } = {}) {
  const [tabSwitches, setTabSwitches] = useState(0);
  const [blurs, setBlurs] = useState(0);
  const submittingRef = useRef(false);
  const latestRef = useRef({ tabSwitches: 0, blurs: 0 });
  latestRef.current = { tabSwitches, blurs };

  useEffect(() => {
    if (!attemptId) return undefined;

    const report = async (event) => {
      try {
        const data = await apiFetch(`/api/exams/attempts/${attemptId}/integrity`, {
          token,
          method: "POST",
          body: { event },
        });
        setTabSwitches(data?.integrity?.tabSwitches ?? latestRef.current.tabSwitches);
        setBlurs(data?.integrity?.blurs ?? latestRef.current.blurs);
        if (data?.shouldAutoSubmit && !submittingRef.current) {
          submittingRef.current = true;
          onAutoSubmit?.();
        }
      } catch {
        
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((n) => n + 1);
        report("visibilityChange");
      }
    };
    const onBlur = () => {
      setBlurs((n) => n + 1);
      report("blur");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
    };
  }, [attemptId, token, onAutoSubmit]);

  useEffect(() => {
    if (tabSwitches > 3 && !submittingRef.current) {
      submittingRef.current = true;
      onAutoSubmit?.();
    }
  }, [tabSwitches, onAutoSubmit]);

  return { tabSwitches, blurs };
}

