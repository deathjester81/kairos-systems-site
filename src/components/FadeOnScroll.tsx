"use client";
import { useEffect, useRef, useState } from "react";

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
      // On mobile, always keep normal state
      setTransform("translateY(0)");
      setOpacity(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Wenn die Sektion von unten hereinkommt
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            
            // Berechne wie weit die Sektion schon sichtbar ist
            const visibleFromBottom = viewportHeight - rect.top;
            const sectionHeight = rect.height;
            
            // Slide-in Effekt: Starte von unten (translateY(100px)) und gleite rein
            if (visibleFromBottom > 0 && visibleFromBottom < viewportHeight * 0.3) {
              // Erste 30% des Viewports: Gleite von unten rein
              const progress = Math.min(visibleFromBottom / (viewportHeight * 0.3), 1);
              const translateY = 100 * (1 - progress); // Von 100px zu 0
              const opacityValue = Math.min(0.3 + progress * 0.7, 1); // Von 0.3 zu 1
              setTransform(`translateY(${translateY}px)`);
              setOpacity(opacityValue);
            } else {
              // Vollständig sichtbar
              setTransform("translateY(0)");
              setOpacity(1);
            }
          } else if (entry.boundingClientRect.top > viewportHeight) {
            // Sektion ist noch unterhalb des Viewports - starte von unten
            setTransform("translateY(100px)");
            setOpacity(0.3);
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

      // Wenn Sektion von unten hereinkommt
      if (rect.top < viewportHeight && rect.top > -rect.height) {
        const visibleFromBottom = viewportHeight - rect.top;
        
        if (visibleFromBottom > 0 && visibleFromBottom < viewportHeight * 0.3) {
          // Erste 30%: Slide-in von unten
          const progress = Math.min(visibleFromBottom / (viewportHeight * 0.3), 1);
          const translateY = 100 * (1 - progress);
          const opacityValue = Math.min(0.3 + progress * 0.7, 1);
          setTransform(`translateY(${translateY}px)`);
          setOpacity(opacityValue);
        } else if (rect.top <= 0) {
          // Sektion ist vollständig sichtbar oder darüber
          setTransform("translateY(0)");
          setOpacity(1);
        }
      } else if (rect.top >= viewportHeight) {
        // Noch nicht sichtbar - starte von unten
        setTransform("translateY(100px)");
        setOpacity(0.3);
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
        transform,
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </section>
  );
}
