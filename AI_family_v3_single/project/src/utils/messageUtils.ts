/**
 * Split a message text into segments based on punctuation
 */
export function segmentMessage(text: string): string[] {
  // 使用正则表达式匹配标点符号（包括中文和英文）
  const segments = text.split(/(?<=[。！？!?.])/g); // 按标点符号分割
  return segments.map((segment) => segment.trim()).filter((segment) => segment.length > 0);
}
/**
 * Generate a unique ID for messages
 */
export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}