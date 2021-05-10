import { up, down } from "@web3api/logging-server";
import { Tracer, LogLevel } from "@web3api/tracing";
import axios from "axios";

export async function startLoggingServer(quiet: boolean): Promise<void> {
  await up(quiet);
}

export async function stopLoggingServer(quiet: boolean): Promise<void> {
  await down(quiet);
}

export async function setLogLevel(level: LogLevel): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (process.env.TRACE_SERVER) {
      Tracer.setLogLevel(level);
      resolve(true);
    }

    const port = process.env.TRACE_SERVER_PORT || 4040;
    axios
      .post(`http://localhost:${port}/level`, {
        level,
      })
      .then(() => {
        resolve(true);
      })
      .catch((err) => reject(err));
  });
}
