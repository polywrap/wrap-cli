import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";

export function configure(builder: ClientConfigBuilder): ClientConfigBuilder {
  const wrapperPath = path.join(__dirname, "..", "run-test-wrapper");
  const wrapperUri = `fs/${path.resolve(wrapperPath)}/build`;
  return builder
    .setRedirect("wrap://ens/test.eth", wrapperUri)
    .addEnv(
      wrapperUri, 
      {
        value: 1,
      }
    );
}
