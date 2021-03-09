import { Input_info, Logger_Query, Logger_LogLevel } from "./w3";

export function debug(input: Input_info): bool {
  Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.DEBUG
  });

  return true;
}

export function info(input: Input_info): bool {
  Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.INFO
  });

  return true;
}

export function warn(input: Input_info): bool {
  Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.WARN
  });

  return true;
}

export function error(input: Input_info): bool {
  Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.ERROR
  });

  return true;
}
