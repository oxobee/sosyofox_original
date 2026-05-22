"use client";

import { motion } from "motion/react";

export function LoadingRipple() {
  return (
    <div className="relative h-12 w-12">
      {[0, 0.35, 0.7].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-full border border-[color:var(--sf-primary)]"
          initial={{ scale: 0.25, opacity: 0.9 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
