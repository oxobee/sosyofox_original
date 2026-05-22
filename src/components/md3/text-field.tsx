import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TextField({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white">
      <span className="text-[color:var(--sf-muted)]">{label}</span>
      <input
        className={cn("min-h-12 rounded-[14px] border border-white/12 bg-black/20 px-4 text-white outline-none transition focus:border-[color:var(--sf-primary)] focus:shadow-[0_0_0_4px_rgba(255,122,26,0.12)]", className)}
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white">
      <span className="text-[color:var(--sf-muted)]">{label}</span>
      <textarea
        className={cn("min-h-28 rounded-[14px] border border-white/12 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-[color:var(--sf-primary)] focus:shadow-[0_0_0_4px_rgba(255,122,26,0.12)]", className)}
        {...props}
      />
    </label>
  );
}
