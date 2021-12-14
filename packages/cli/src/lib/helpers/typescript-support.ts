/* eslint-disable @typescript-eslint/no-require-imports */
import { intlMsg } from "../intl";

export function loadTsNode(): void {
  try {
    require.resolve("typescript");
  } catch (error) {
    throw new Error(intlMsg.lib_typescript_notInstalled());
  }

  try {
    require.resolve("ts-node");
  } catch (error) {
    throw new Error(intlMsg.lib_typescript_tsNodeNotInstalled());
  }

  // If we are running tests we just want to transpile
  if (process.env.TEST) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    require("ts-node/register/transpile-only");
    return;
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  require("ts-node/register");
}

export function isTypescriptFile(path: string): boolean {
  return path.endsWith(".ts");
}
