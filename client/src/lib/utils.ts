import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions from original codebase
export function sanitizePage(page: string | null): number {
  if (!page) return 1
  const pageNumber = parseInt(page, 10)
  return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber
}

// Default export for backward compatibility
const utils = {
  cn,
  sanitizePage,
}

export default utils
