import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number | string, currency = "TRY") {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `0${currency === "TRY" ? "₺" : ` ${currency}`}`;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);

  return currency === "TRY" ? `${formatted}₺` : `${formatted} ${currency}`;
}

export function formatNumber(value: number | string) {
  return new Intl.NumberFormat("tr-TR").format(Number(value));
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
