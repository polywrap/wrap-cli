import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  const wrapperPath = path.join(__dirname, "..", "run-test-wrapper");
  const wrapperUri = `fs/${path.resolve(wrapperPath)}/build`;
  return builder
    .addRedirect("wrap://ens/test.eth", wrapperUri)
    .addEnv(
      wrapperUri, 
      {
        value: 1,
      }
    );
}
