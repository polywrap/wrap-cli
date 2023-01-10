import { getDefaultLogFileName } from "../option-defaults";

export function parseLogFileOption(
  logFile: string | boolean | undefined
): string | false {
  if (logFile) {
    if (logFile === true) {
      return getDefaultLogFileName();
    }
    return logFile;
  }

  return false;
}
