import { Logger, ConsoleLog } from "../../lib";

import { LogLevel } from "@polywrap/logging-js";

export function createLogger(flags: {
  verbose?: boolean;
  quiet?: boolean;
}): Logger {
  const level = flags.quiet
    ? LogLevel.ERROR
    : flags.verbose
    ? LogLevel.DEBUG
    : LogLevel.INFO;

  return new Logger({
    console: new ConsoleLog(level),
  });
}
