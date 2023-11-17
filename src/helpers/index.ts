export const LogError = (msg: string) => {
  console.error(`[ERROR] ${msg}`);
  process.exit(1);
};

export const LogInfo = (msg: any) => {
  console.info("[INFO] ", msg);
};

/**
 * get named args from process.env
 * - expects `--` to denote the start of a key
 * - expects `=` to denote the end of a key and start of a value
 * @example
 * --name=johnDoe
 */
export const mapArgs = (args: string[]) => {
  const argMap = new Map<string, string>();

  args.forEach(arg => {
    const [key, value] = arg.split("=");
    if (key.startsWith("--")) {
      argMap.set(key.substring(2), value);
    } else {
      LogError(`Invalid argument format: ${arg}`);
    }
  });
  return argMap;
};
