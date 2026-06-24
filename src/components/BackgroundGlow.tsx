import React from "react";
import { motion } from "motion/react";

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none select-none">
      {/* Sleek CSS grid lines overlay (Kora / Gravity styled) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        style={{ opacity: 0.8 }}
      />

      {/* Animated glowing fluid gradient spots */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Spot 1: Mint Green Orb */}
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
          className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-green-500/5 dark:bg-green-500/[0.03] blur-[120px]"
        />

        {/* Spot 2: Gold/Yellow Orb */}
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
          className="absolute top-[20%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-yellow-500/[0.04] dark:bg-yellow-500/[0.02] blur-[100px]"
        />

        {/* Spot 3: Subtle Teal/Emerald Ambient */}
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
          className="absolute bottom-[10%] left-[30%] w-[25rem] h-[25rem] rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.015] blur-[90px]"
        />
      </div>

      {/* Subtle vignettes overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-transparent pointer-events-none" />
    </div>
  );
}
