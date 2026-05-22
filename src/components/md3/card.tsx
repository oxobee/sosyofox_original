"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4, rotateX: 1.2, rotateY: -1.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("sf-card sf-glow p-5", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
