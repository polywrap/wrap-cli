/* eslint-disable */

// Log message
@external("w3", "__w3_log")
export declare function __w3_log(
  logLevel: u32,
  messagePtr: u32,
  messageLen: u32
): void;

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}

// Helper for logging
export function w3_log(logLevel: LogLevel, message: string): void {
  const messageBuf = String.UTF8.encode(message);


  __w3_log(
    logLevel,
    changetype<u32>(messageBuf),
    messageBuf.byteLength
  )
}
