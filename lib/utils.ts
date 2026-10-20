// Source: shadcn/ui manual installation helper, MIT license.
// https://v3.shadcn.com/docs/installation/manual
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
