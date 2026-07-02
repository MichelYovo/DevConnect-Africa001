import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function BackgroundGlow() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none select-none">
      
      {/* 1. Standard Static/Ambient CSS grid lines overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_0%,#000_80%,transparent_100%)]"
        style={{ opacity: 0.8 }}
      />

      {/* 2. Interactive Spotlight highlighting the grid cells */}
      {isHovering && (
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1.5px,transparent_1.5px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] transition-all duration-300 ease-out"
          style={{
            maskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          }}
        />
      )}

      {/* 3. Smooth cursor following glowing radial backdrop spotlight */}
      {isHovering && (
        <>
          {/* Main bright indigo core spotlight */}
          <div 
            className="absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.03), transparent 80%)`,
            }}
          />
          {/* Secondary blue micro accent trail spotlight for contrast */}
          <div 
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              background: `radial-gradient(150px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.015), transparent 70%)`,
            }}
          />
        </>
      )}

      {/* 4. Animated glowing fluid gradient spots (Slow moving) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Spot 1: Blue/Indigo Orb */}
        <motion.div
          animate={{
            x: [-40, 40, -40],
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.02] blur-[120px]"
        />

        {/* Spot 2: Slate/Silver Orb */}
        <motion.div
          animate={{
            x: [40, -40, 40],
            y: [30, -30, 30],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-slate-500/[0.015] dark:bg-slate-500/[0.008] blur-[100px]"
        />

        {/* Spot 3: Subtle Cool Blue Ambient */}
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [20, -20, 20],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] left-[30%] w-[25rem] h-[25rem] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.01] blur-[90px]"
        />
      </div>

      {/* 5. Floating Shimmering Stars/Particles to make the app background feel alive */}
      <div className="absolute inset-0">
        {[
          { top: "12%", left: "8%", delay: 0, duration: 7 },
          { top: "28%", left: "82%", delay: 2, duration: 9 },
          { top: "42%", left: "38%", delay: 4, duration: 8 },
          { top: "60%", left: "18%", delay: 1, duration: 10 },
          { top: "72%", left: "75%", delay: 3, duration: 11 },
          { top: "88%", left: "22%", delay: 1.5, duration: 7 },
          { top: "5%", left: "60%", delay: 2.5, duration: 8 },
          { top: "93%", left: "80%", delay: 0.5, duration: 10 }
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 blur-[0.4px]"
            style={{
              top: p.top,
              left: p.left,
            }}
            animate={{
              y: [-12, 12, -12],
              opacity: [0.15, 0.8, 0.15],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle vignettes overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 dark:to-transparent pointer-events-none" />
    </div>
  );
}
