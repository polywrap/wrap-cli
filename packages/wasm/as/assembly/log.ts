
/* eslint-disable */

// Log message
@external("w3", "__w3_log")
export declare function __w3_log(
  logLevelPtr: u32,
  logLevelLen: u32,
  messagePtr: u32,
  messageLen: u32
): void;

export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

// Helper for __w3_log
export function w3_log(logLevel: LogLevel, message: string): void {
  const logLevelBuf = String.UTF8.encode(logLevel.toString());
  const messageBuf = String.UTF8.encode(message);


  __w3_log(
    changetype<u32>(logLevelBuf), logLevelBuf.byteLength,
    changetype<u32>(messageBuf), logLevelBuf.byteLength
  )
}
