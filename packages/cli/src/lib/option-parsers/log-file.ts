import { getDefaultLogFileName } from "../option-defaults";

export function parseLogFileOption(
  logFile: string | boolean | undefined
): string | undefined {
  if (logFile) {
    if (logFile === true) {
      return getDefaultLogFileName();
    }
    return logFile;
  }

  return undefined;
}