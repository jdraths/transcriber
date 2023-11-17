import * as fs from "fs";

/**Function to encode an audio file to base64 */
export function encodeAudioToBase64(filePath: string): string {
  // Read the audio file as a binary buffer
  const audioBuffer = fs.readFileSync(filePath);

  // Convert the binary buffer to a base64-encoded string
  const base64Encoded = audioBuffer.toString("base64");

  return base64Encoded;
}
