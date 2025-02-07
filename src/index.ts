import { LogError, LogInfo, mapArgs } from "./helpers";
import { transcribe } from "./functions/transcribe";
import { transformJson } from "./functions/transformJson";

// get & format args
const args = process.argv.slice(2);
const argMap = mapArgs(args);

// parse args
const filename = argMap.get("filename");
if (!filename) {
  LogError("'filename' argument is required");
}
const prompt = argMap.get("prompt");
if (!prompt) {
  LogError("'prompt' argument is required. A good prompt is 'John Doe & Jane Smith interviewing Sam Samson'ex");
}
const filepath = argMap.get("filepath");
if (!filepath) {
  LogError("'filepath' argument is required. It should be the url where the transcriber can download the audio");
}
const numSpeakers = Number(argMap.get("speakers"));
if (!numSpeakers) {
  LogInfo("'speakers' argument was not passed. Assuming 2 speakers.");
}

// process func
if (!!filename && !!prompt && !!filepath) {
  const outputTranscription = await transcribe({ filename, localFilePath: filepath, prompt, numSpeakers });
  const outputMdPath = transformJson({ outputTranscription, filename });
  LogInfo("process complete");
  LogInfo(outputMdPath);
}
