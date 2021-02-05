import * as testEnv from "@web3api/client-test-env";

export async function startupTestEnv(
  quiet: boolean,
  configFilePath: string,
  ci: boolean
): Promise<void> {
  await testEnv.up(quiet, configFilePath, ci);
}

export async function shutdownTestEnv(
  quiet: boolean,
  configFilePath: string,
  ci: boolean
): Promise<void> {
  await testEnv.down(quiet, configFilePath, ci);
}
