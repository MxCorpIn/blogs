import { clsx, type ClassValue } from "clsx";

/** Merge class names with clsx, dropping falsy values. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
