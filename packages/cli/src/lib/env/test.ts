import * as testEnv from "@web3api/client-test-env";

export async function startupTestEnv(quiet: boolean): Promise<void> {
  await testEnv.up(quiet);
}

export async function shutdownTestEnv(quiet: boolean): Promise<void> {
  await testEnv.down(quiet);
}
