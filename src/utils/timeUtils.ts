/**
 * Format a date to 24-hour format time (e.g., "1605")
 */
export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}