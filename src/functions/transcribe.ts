import * as fs from "fs";
import Replicate from "replicate";
import { LogInfo } from "../helpers";

export const transcribe = async ({
  filename,
  audioUrl,
  prompt,
  numSpeakers = 2,
}: {
  filename: string;
  audioUrl: string;
  prompt: string;
  numSpeakers?: number;
}) => {
  LogInfo("starting transcription");

  const input = {
    prompt,
    // file: inputFilePath,
    // file_string: base64Data,
    file_url: audioUrl,
    num_speakers: numSpeakers,
    group_segments: true,
    offset_seconds: 0,
    language: "en",
  };
  LogInfo(input);

  const outputDir = "./output";
  const outputJsonPath = `${outputDir}/${filename}.json`;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const output = await replicate.run(
    "thomasmol/whisper-diarization:7fa6110280767642cf5a357e4273f27ec10ebb60c107be25d6e15f928fd03147",
    {
      input,
    },
  );

  const jsonString = JSON.stringify(output);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }); // The option `recursive` is set to true to ensure that it creates the directory if it doesn't exist
  }

  // Write the JSON data to the file
  fs.writeFileSync(outputJsonPath, jsonString, "utf-8");

  LogInfo("Transcription Complete.");
  LogInfo(`JSON data saved to ${outputJsonPath}`);
  return outputJsonPath;
};
