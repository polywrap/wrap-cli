import * as testEnv from "@web3api/client-test-env";

export async function startupTestEnv(quiet: boolean, ganacheCli?: boolean, ipfs?: boolean): Promise<void> {
  await testEnv.up(quiet);
}

export async function shutdownTestEnv(quiet: boolean, ganacheCli?: boolean, ipfs?: boolean): Promise<void> {
  await testEnv.down(quiet);
}
