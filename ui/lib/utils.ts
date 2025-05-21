import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to simulate API delay
export const simulateApiDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))
