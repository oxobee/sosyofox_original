import { cn } from "@/lib/utils";

export function MdIcon({ name, className }: { name: string; className?: string }) {
  return <span className={cn("material-symbols-rounded", className)} aria-hidden>{name}</span>;
}
