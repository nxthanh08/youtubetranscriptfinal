import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format timestamp from seconds to SRT/VTT format (00:00:00,000)
export function formatTimestamp(
  seconds: number,
  format: "srt" | "vtt" = "srt",
): string {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const secs = date.getUTCSeconds().toString().padStart(2, "0");
  const ms = date.getUTCMilliseconds().toString().padStart(3, "0");

  return format === "srt"
    ? `${hours}:${minutes}:${secs},${ms}`
    : `${hours}:${minutes}:${secs}.${ms}`;
}

// Convert transcript to SRT format
export function convertToSRT(transcript: string): string {
  // Simple conversion for plain text - in a real app, you would parse timestamps
  const lines = transcript.split("\n").filter((line) => line.trim() !== "");
  let srtContent = "";

  lines.forEach((line, index) => {
    const startTime = index * 5; // Assume each line takes 5 seconds
    const endTime = startTime + 5;

    srtContent += `${index + 1}\n`;
    srtContent += `${formatTimestamp(startTime)} --> ${formatTimestamp(endTime)}\n`;
    srtContent += `${line}\n\n`;
  });

  return srtContent;
}

// Convert transcript to VTT format
export function convertToVTT(transcript: string): string {
  // Simple conversion for plain text
  const lines = transcript.split("\n").filter((line) => line.trim() !== "");
  let vttContent = "WEBVTT\n\n";

  lines.forEach((line, index) => {
    const startTime = index * 5; // Assume each line takes 5 seconds
    const endTime = startTime + 5;

    vttContent += `${index + 1}\n`;
    vttContent += `${formatTimestamp(startTime, "vtt")} --> ${formatTimestamp(endTime, "vtt")}\n`;
    vttContent += `${line}\n\n`;
  });

  return vttContent;
}

// Convert transcript to CSV format
export function convertToCSV(transcript: string): string {
  const lines = transcript.split("\n").filter((line) => line.trim() !== "");
  let csvContent = "Index,Start Time,End Time,Text\n";

  lines.forEach((line, index) => {
    const startTime = index * 5; // Assume each line takes 5 seconds
    const endTime = startTime + 5;

    // Escape quotes in the text for CSV
    const escapedText = line.replace(/"/g, '""');

    csvContent += `${index + 1},"${formatTimestamp(startTime)}","${formatTimestamp(endTime)}","${escapedText}"\n`;
  });

  return csvContent;
}
