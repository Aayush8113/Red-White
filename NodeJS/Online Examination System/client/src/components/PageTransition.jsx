import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export function PageTransition({ children }) {
  const ref = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
      );
    }, ref);
    return () => ctx.revert();
  }, [location.key]);

  return <div ref={ref}>{children}</div>;
}

