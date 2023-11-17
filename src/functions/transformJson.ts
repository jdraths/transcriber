import * as fs from "fs";
import { LogInfo } from "../helpers";

// Helper function to format timestamps
function formatTimestamp(timestamp: string): string {
  const [seconds, milliseconds] = timestamp.split(".").map(Number);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  const formattedMilliseconds = milliseconds < 10 ? `0${milliseconds}` : `${milliseconds}`;
  return `[${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}]`;
}

export const transformJson = ({ inputJsonPath, filename }: { inputJsonPath: string; filename: string }) => {
  LogInfo("transforming json to md");
  const outputMdPath = `./output/${filename}.md`;

  // Read the input JSON file
  const inputData = JSON.parse(fs.readFileSync(inputJsonPath, "utf-8"));

  // Initialize variables to keep track of the current speaker and timestamp
  let currentSpeaker = "";
  let currentTimestamp = "";

  // Extract segments and convert to Markdown with formatted timestamps
  const markdownText = inputData.segments
    .map((segment: { speaker: string; text: string; start: string; end: string }) => {
      // Check if the speaker has changed
      if (segment.speaker !== currentSpeaker) {
        currentSpeaker = segment.speaker;
        currentTimestamp = formatTimestamp(segment.start);
      } else {
        currentTimestamp = formatTimestamp(segment.end);
      }

      return `**${segment.speaker}**\n${currentTimestamp}\n${segment.text}\n\n`;
    })
    .join("");

  // Write the Markdown to the output file
  fs.writeFileSync(outputMdPath, markdownText, "utf-8");

  LogInfo("md complete");
  LogInfo(`Markdown data saved to ${outputMdPath}`);
  return outputMdPath;
};
