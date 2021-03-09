import { Input_info, Logger_Query, Logger_LogLevel } from "./w3";

export function info(input: Input_info): boolean {
  Logger_Query.log({
    message: input.message,
    level: Logger_LogLevel.INFO
  });

  return true;
}
