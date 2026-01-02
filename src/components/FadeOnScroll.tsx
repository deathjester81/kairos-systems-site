"use client";
import { useEffect, useRef, useState } from "react";

interface FadeOnScrollProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function FadeOnScroll({ children, className = "", id }: FadeOnScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [opacity, setOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device is mobile (less than 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isMobile) {
      // On mobile, always keep opacity at 1
      setOpacity(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Wenn die Sektion den oberen Rand verlässt (exit)
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            // Berechne Opacity basierend auf wie weit sie rausgescrollt ist
            const scrollProgress = Math.min(
              Math.abs(entry.boundingClientRect.top) / window.innerHeight,
              1
            );
            // Fade startet erst bei 80% rausgescrollt (also ganz am Ende)
            const fadeStart = 0.8;
            if (scrollProgress > fadeStart) {
              const fadeAmount = (scrollProgress - fadeStart) / (1 - fadeStart);
              setOpacity(Math.max(0, 1 - fadeAmount * 1.2)); // 1.2 für sanfteren Fade
            } else {
              setOpacity(1);
            }
          } else {
            setOpacity(1);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "0px",
      }
    );

    observer.observe(section);

    // Scroll Listener für präzisere Kontrolle
    const handleScroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Wenn Sektion oben raus ist
      if (rect.top < 0 && rect.bottom > 0) {
        const scrollProgress = Math.abs(rect.top) / viewportHeight;
        const fadeStart = 0.8; // Startet bei 80% rausgescrollt
        if (scrollProgress > fadeStart) {
          const fadeAmount = (scrollProgress - fadeStart) / (1 - fadeStart);
          setOpacity(Math.max(0, 1 - fadeAmount * 1.2));
        } else {
          setOpacity(1);
        }
      } else if (rect.top >= 0) {
        setOpacity(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        opacity,
        transition: "opacity 0.3s ease-out, filter 0.3s ease-out",
        filter: opacity < 0.5 ? `blur(${(1 - opacity) * 8}px)` : "blur(0px)",
      }}
    >
      {children}
    </section>
  );
}
