"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MdIcon } from "./icon";

type ButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & {
  children: ReactNode;
  icon?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "bg-[linear-gradient(135deg,#ff9a2e,#f35f1e_48%,#b3261e)] text-white shadow-[0_18px_42px_rgba(255,122,26,0.28)]",
  secondary: "border border-white/12 bg-white/8 text-white",
  ghost: "bg-transparent text-[color:var(--sf-muted)] hover:text-white",
  danger: "bg-[color:var(--sf-red)] text-white"
};

export function Button({ className, children, icon, variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 py-2 font-semibold transition", variants[variant], className)}
      {...props}
    >
      {icon ? <MdIcon name={icon} /> : null}
      {children}
    </motion.button>
  );
}

export function ButtonLink({
  className,
  children,
  icon,
  variant = "primary",
  href
}: {
  className?: string;
  children: React.ReactNode;
  icon?: string;
  variant?: keyof typeof variants;
  href: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
      <Link href={href} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 py-2 font-semibold transition", variants[variant], className)}>
        {icon ? <MdIcon name={icon} /> : null}
        {children}
      </Link>
    </motion.div>
  );
}
