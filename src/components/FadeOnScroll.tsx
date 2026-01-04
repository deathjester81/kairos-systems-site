"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface FadeOnScrollProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function FadeOnScroll({ children, className = "", id }: FadeOnScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState("translateY(0)");
  const [opacity, setOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const updatePosition = useCallback(() => {
    const section = sectionRef.current;
    if (!section || isMobile) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Section below viewport – start state
    if (rect.top >= viewportHeight) {
      setTransform("translateY(100px)");
      setOpacity(0.3);
      return;
    }

    // Section entering from bottom
    if (rect.top < viewportHeight && rect.top > -rect.height) {
      const visibleFromBottom = viewportHeight - rect.top;
      
      if (visibleFromBottom > 0 && visibleFromBottom < viewportHeight * 0.3) {
        const progress = visibleFromBottom / (viewportHeight * 0.3);
        setTransform(`translateY(${100 * (1 - progress)}px)`);
        setOpacity(0.3 + progress * 0.7);
        return;
      }
    }

    // Fully visible
    setTransform("translateY(0)");
    setOpacity(1);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setTransform("translateY(0)");
      setOpacity(1);
      return;
    }

    // Use passive scroll listener for performance
    window.addEventListener("scroll", updatePosition, { passive: true });
    updatePosition(); // Initial check

    return () => window.removeEventListener("scroll", updatePosition);
  }, [isMobile, updatePosition]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        opacity,
        transform,
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        willChange: isMobile ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </section>
  );
}
