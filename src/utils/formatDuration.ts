/**
 * Formats a duration in hours into a string representation of days and hours or just hours
 * @param hours - The duration in hours
 * @returns A formatted string like "2d 16h" for durations >= 24 hours, or "16 hours" for durations < 24 hours
 */
export function formatDuration(hours: number): string {
  if (hours < 24) {
    return `${hours} hours`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return `${days}d ${remainingHours}h`;
} 