import { up, down } from "@web3api/logging-server";
import { Tracer, LogLevel } from "@web3api/tracing";

export async function startLoggingServer(quiet: boolean): Promise<void> {
  await up(quiet);
}

export async function stopLoggingServer(quiet: boolean): Promise<void> {
  await down(quiet);
}

export function setLogLevel(level: LogLevel): Promise<boolean> {
  return Tracer.setLogLevel(level);
}
