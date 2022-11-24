import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Env, Uri } from "@polywrap/core-js";
import fs from "fs";

export async function parseWrapperEnvsOption(
  wrapperEnvsPath: string | undefined
): Promise<Readonly<Env<Uri>[]> | undefined> {
  if (!wrapperEnvsPath) {
    return undefined;
  }

  const envsFileContents = fs.readFileSync(wrapperEnvsPath, {
    encoding: "utf-8",
  });

  const envs = JSON.parse(envsFileContents) as Record<
    string,
    Record<string, unknown>
  >;

  const builder = new ClientConfigBuilder();

  for (const env in envs) {
    builder.addEnv(env, envs[env]);
  }

  return builder.buildCoreConfig().envs;
}
