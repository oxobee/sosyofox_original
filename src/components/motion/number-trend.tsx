"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export function NumberTrend({ value, suffix = "" }: { value: number; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(() => `${Math.round(motionValue.get()).toLocaleString("tr-TR")}${suffix}`);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.1, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
}
