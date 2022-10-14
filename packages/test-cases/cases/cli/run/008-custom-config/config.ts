import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapCoreClientConfig } from "@polywrap/client-js";
import { MaybeAsync, Uri } from "@polywrap/core-js";
import path from "path";

export function buildClientConfig(
  builder: ClientConfigBuilder
): MaybeAsync<PolywrapCoreClientConfig<Uri | string>> {
  const wrapperPath = path.join(__dirname, "..", "run-test-wrapper");
  const wrapperUri = `fs/${path.resolve(wrapperPath)}/build`;
  return builder
    .add({
      redirects: [
        {
          from: "wrap://ens/test.eth",
          to: wrapperUri,
        },
      ],
      envs: [
        {
          uri: wrapperUri,
          env: {
            value: 1,
          },
        },
      ],
    })
    .buildDefault();
}
