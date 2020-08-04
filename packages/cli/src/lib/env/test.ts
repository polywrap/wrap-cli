const testEnv = require("@web3api/client-test-env");

export async function startupTestEnv() {
  await testEnv.up();
}

export async function shutdownTestEnv() {
  await testEnv.down();
}
