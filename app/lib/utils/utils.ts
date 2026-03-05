import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toISODateOnly(d: Date | null | undefined): string | null {
  if (!d) return null;
  // yyyy-mm-dd
  return d.toISOString().slice(0, 10);
}