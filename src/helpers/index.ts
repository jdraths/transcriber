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
    if (arg.startsWith("--")) {
      const index = arg.indexOf("=");
      if (index === -1) {
        LogError(`Invalid argument format: ${arg}`);
      }
      const key = arg.substring(2, index);
      const value = arg.substring(index + 1);
      argMap.set(key, value);
    } else {
      LogError(`Invalid argument format: ${arg}`);
    }
  });
  return argMap;
};
