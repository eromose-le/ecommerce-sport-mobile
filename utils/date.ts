import {
  subDays,
  format,
  parseISO,
  isValid,
  formatDistanceToNow,
} from "date-fns";

export function substractDaysFromTodaysDate(DAY_COUNT: number) {
  // Get today's date and subtract count days
  const substractedDayAgo = subDays(new Date(), DAY_COUNT);
  return format(substractedDayAgo, "yyyy-MM-dd"); // Format the date as desired
}

export const transformMatchDate = (dateString: any): string => {
  try {
    if (typeof dateString !== "string" || dateString.trim() === "") {
      console.warn("Invalid dateString provided:", dateString);
      return "Invalid date";
    }

    const date = parseISO(dateString);
    if (!isValid(date)) {
      console.warn("Parsed date is invalid:", dateString);
      return "Invalid date";
    }

    return format(date, "dd MMM, yyyy (HH:mm)");
  } catch (error) {
    console.error("Error in transformMatchDate:", error);
    return "Invalid date";
  }
};

/**
 * Calculate time ago from a given date
 * @param dateString - The input date string
 * @returns {string} - A human-readable "time ago" string
 */
export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString);

  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Function to format a date string into 'MMM d, yyyy' format.
 * Example: "Oct 8, 2024"
 *
 * @param dateString - The date string to format (in ISO 8601 format)
 * @returns Formatted date string in the format 'MMM d, yyyy' or an error message if invalid
 */
export function formatDate(dateString: string): string {
  // Step 1: Validate and parse the input date
  const parsedDate = parseISO(dateString);

  // Step 2: Check if the parsed date is valid
  if (!isValid(parsedDate)) {
    throw new Error(
      "Invalid date format. Please provide a valid ISO 8601 date string."
    );
  }

  // Step 3: Format the date to 'MMM d, yyyy' (e.g., "Oct 8, 2024")
  return format(parsedDate, "MMM d, yyyy");
}
