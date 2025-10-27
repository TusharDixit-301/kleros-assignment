import clsx, { ClassValue } from "clsx";
import numeral from "numeral";
import { twMerge } from "tailwind-merge";

/**
 * Formats a number with magnitude (K, M, B) and appropriate decimal places
 */
export const formatNumberWithMagnitude = (number: number | string) => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return "-";
  }

  if (number === 0) {
    return "0";
  }

  if (number >= 1) {
    if (number > 99999) {
      return numeral(number).format("0.00a");
    }
    if (number > 9999) {
      return numeral(number).format("0.00a");
    }
    return numeral(number).format("0.00a");
  }
  if (number < 0.0001) {
    return "<0.0001";
  }
  if (number < 0.001) {
    return numeral(number).format("0.0[0000]");
  }
  if (number < 1) {
    return numeral(number).format("0.00[00]");
  }

  return numeral(number).format("0.00");
};

/**
 * Shortens an address by keeping a specified number of characters at the start and end
 */
export const shortenAddress = (address: string | undefined, chars = 4) =>
  address ? `${address.slice(0, chars + 2)}...${address.slice(-chars)}` : "";

/**
 * Formats a number as a percentage with 2 decimal places
 */
export const formatPercentage = (number: number | string): string => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return "-";
  }

  return numeral(number).format("0.00%");
};

/**
 * Formats a number as currency with appropriate decimal places
 */
export const formatCurrency = (number: number | string, currency = "USD"): string => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (isNaN(number)) {
    return "-";
  }

  const formatted = numeral(number).format("0,0.00");
  return currency === "USD" ? `$${formatted}` : `${formatted} ${currency}`;
};

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Timeout reached";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Formats css classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
