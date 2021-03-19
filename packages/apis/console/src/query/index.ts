import { Input_info, Logger_Query, Logger_LogLevel } from "./w3";

export function debug(input: Input_info): bool {
  return Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.DEBUG
  });
}

export function info(input: Input_info): bool {
  return Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.INFO
  });
}

export function warn(input: Input_info): bool {
  return Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.WARN
  });
}

export function error(input: Input_info): bool {
  return Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.ERROR
  });
}
