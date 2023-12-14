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
  // const inputFilePath = "";
  // const base64Data = encodeAudioToBase64(inputFilePath);
  const outputJsonPath = `./output/${filename}.json`;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const output = await replicate.run(
    "thomasmol/whisper-diarization:c558e6f7efba0b8e6f4155be9e930d5bd92d788cd3e31396f4c33b5aac984975",
    {
      input,
    },
  );

  const jsonString = JSON.stringify(output);

  // Define the file path where you want to save the JSON data

  // Write the JSON data to the file
  fs.writeFileSync(outputJsonPath, jsonString, "utf-8");

  LogInfo("Transcription Complete.");
  LogInfo(`JSON data saved to ${outputJsonPath}`);
  return outputJsonPath;
};
