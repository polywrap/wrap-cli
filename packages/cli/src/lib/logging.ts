import { up, down } from "@web3api/logging-server";

export async function startLoggingServer(quiet: boolean): Promise<void> {
  await up(quiet);
}

export async function stopLoggingServer(quiet: boolean): Promise<void> {
  await down(quiet);
}
