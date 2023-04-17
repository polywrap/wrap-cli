import { loadEnvironmentVariables } from "../system";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import fs from "fs";
import YAML from "yaml";

type WrapperEnvs = Record<string, Record<string, unknown>>;

export async function parseWrapperEnvsOption(
  wrapperEnvsPath: string | false | undefined
): Promise<Readonly<Record<string, Record<string, unknown>>> | undefined> {
  if (!wrapperEnvsPath) {
    return undefined;
  }

  const envsFileContents = fs.readFileSync(wrapperEnvsPath, {
    encoding: "utf-8",
  });

  let envs: WrapperEnvs;

  try {
    envs = JSON.parse(envsFileContents) as WrapperEnvs;
  } catch (_) {
    try {
      envs = YAML.parse(envsFileContents) as WrapperEnvs;
    } catch (_) {
      throw new Error(`Unable to parse wrapper envs file: ${wrapperEnvsPath}`);
    }
  }

  const wrapperEnvs = loadEnvironmentVariables(envs) as Record<
    string,
    Record<string, unknown>
  >;

  const builder = new ClientConfigBuilder();

  for (const env in wrapperEnvs) {
    builder.addEnv(env, wrapperEnvs[env]);
  }

  return builder.config.envs;
}
