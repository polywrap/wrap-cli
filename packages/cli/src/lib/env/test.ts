import * as testEnv from "@web3api/client-test-env";

export async function startupTestEnv(
  quiet: boolean,
  configFilePath: string,
  ci: boolean,
  modules: string[]
): Promise<void> {
  await testEnv.up(quiet, configFilePath, ci, modules);
}

export async function shutdownTestEnv(
  quiet: boolean,
  configFilePath: string,
  ci: boolean,
  modules: string[]
): Promise<void> {
  await testEnv.down(quiet, configFilePath, ci, modules);
}

export const supportedModules: string[] = Array.from(
  testEnv.modulesToDockerComposeFiles.keys()
);
