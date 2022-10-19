import { PolywrapClientConfig } from "@polywrap/client-js";
import path from "path";

export async function getClientConfig(
  defaultConfigs: Partial<PolywrapClientConfig>
): Promise<Partial<PolywrapClientConfig>> {
  const wrapperPath = path.join(__dirname, "..", "run-test-wrapper");
  const wrapperUri = `fs/${path.resolve(wrapperPath)}/build`;
  return {
    redirects: [
      {
        from: "wrap://ens/test.eth",
        to: wrapperUri
      }
    ],
    envs: [
      {
        uri: wrapperUri,
        env: {
          value: 1
        }
      },
    ],
  }
}
