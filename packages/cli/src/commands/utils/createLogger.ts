import { Logger, ConsoleLog, Logs, FileLog } from "../../lib";

import { LogLevel } from "@polywrap/logging-js";

export function createLogger(options: {
  verbose?: boolean;
  quiet?: boolean;
  logFile?: string;
}): Logger {
  const level = options.quiet
    ? LogLevel.ERROR
    : options.verbose
    ? LogLevel.DEBUG
    : LogLevel.INFO;

  const logs: Logs = {
    console: new ConsoleLog(level),
  };

  if (options.logFile) {
    logs["file"] = new FileLog(options.logFile, level);
  }

  return new Logger(logs);
}
