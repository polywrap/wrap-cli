import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Env, Uri } from "@polywrap/core-js";
import fs from "fs";
import YAML from "yaml";

type WrapperEnvs = Record<string, Record<string, unknown>>;

export async function parseWrapperEnvsOption(
  wrapperEnvsPath: string | undefined
): Promise<Readonly<Env<Uri>[]> | undefined> {
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

  const builder = new ClientConfigBuilder();

  for (const env in envs) {
    builder.addEnv(env, envs[env]);
  }

  return builder.buildCoreConfig().envs;
}
