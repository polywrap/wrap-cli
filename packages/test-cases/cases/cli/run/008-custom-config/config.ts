import { ClientConfig } from "@polywrap/client-config-builder-js";
import path from "path";

export function getCustomConfig(): Partial<ClientConfig<string>> {
  const wrapperPath = path.join(__dirname, "..", "run-test-wrapper");
  const wrapperUri = `fs/${path.resolve(wrapperPath)}/build`;
  return {
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
  };
}
