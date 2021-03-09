import { Logger_Query, Logger_LogLevel } from "./w3/imported";
import { Input_info } from "./w3";

export function info(input: Input_info): boolean {
  Logger_Query.log(Logger_LogLevel.INFO, input.message);

  return true;
}
