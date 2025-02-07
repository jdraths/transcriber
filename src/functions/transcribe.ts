import * as fs from "fs";
import Replicate from "replicate";
import { LogInfo } from "../helpers";
import { uploadFileToS3 } from "./uploadFile";

export interface TranscribeResult {
  outputPath: string;
  s3Key: string; // Store the S3 key for future reference
}

export const transcribe = async ({
  filename,
  localFilePath,
  prompt,
  numSpeakers = 2,
}: {
  filename: string;
  localFilePath: string;
  prompt: string;
  numSpeakers?: number;
}): Promise<TranscribeResult> => {
  LogInfo("starting transcription");

  // Upload the file and get a pre-signed URL
  const { signedUrl, key } = await uploadFileToS3(localFilePath);

  const input = {
    prompt,
    file_url: signedUrl,
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
    "thomasmol/whisper-diarization:cbd15da9f839c5f932742f86ce7def3a03c22e2b4171d42823e83e314547003f",
    {
      input,
    },
  );

  const jsonString = JSON.stringify(output);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the JSON data to the file
  fs.writeFileSync(outputJsonPath, jsonString, "utf-8");

  LogInfo("Transcription Complete.");
  LogInfo(`JSON data saved to ${outputJsonPath}`);

  return {
    outputPath: outputJsonPath,
    s3Key: key,
  };
};
