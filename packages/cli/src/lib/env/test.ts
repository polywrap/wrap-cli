const testEnv = require("@web3api/client-test-env");

export async function startupTestEnv(quiet: boolean) {
  await testEnv.up(quiet);
}

export async function shutdownTestEnv(quiet: boolean) {
  await testEnv.down(quiet);
}
