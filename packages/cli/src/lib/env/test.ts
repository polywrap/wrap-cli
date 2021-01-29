import * as testEnv from "@web3api/client-test-env";

export async function startupTestEnv(
  quiet: boolean,
  directory: string,
  ci: boolean
): Promise<void> {
  await testEnv.up(quiet, directory, ci);
}

export async function shutdownTestEnv(
  quiet: boolean,
  directory: string,
  ci: boolean
): Promise<void> {
  await testEnv.down(quiet, directory, ci);
}
