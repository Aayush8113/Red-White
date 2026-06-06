import { useEffect } from 'react';
import gsap from 'gsap';

export const useGsapScroll = (scrollRef) => {
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    let targetScrollTop = element.scrollTop;
    let isScrolling = false;

    const handleWheel = (e) => {
      // Avoid intercepting inside small scrollable nodes (like logs or charts)
      if (e.target.closest('.custom-scrollbar')) return;

      e.preventDefault();
      
      const delta = e.deltaY * 0.8; // fine-tune scrolling sensitivity
      targetScrollTop = Math.max(0, Math.min(element.scrollHeight - element.clientHeight, targetScrollTop + delta));
      
      if (!isScrolling) {
        isScrolling = true;
      }
      
      gsap.to(element, {
        scrollTop: targetScrollTop,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          isScrolling = false;
        }
      });
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [scrollRef]);
};
