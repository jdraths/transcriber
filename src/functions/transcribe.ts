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
    "thomasmol/whisper-diarization:249170b5f45bb1e0aa68440f1f28ef25f5ee50a882af365555068f1f61ae791b",
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
