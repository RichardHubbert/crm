
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format currency in GBP
export function formatGBP(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}

// Utility function to format dates in UK format
export function formatUKDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-GB');
}
