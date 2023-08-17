import { BaseEthereum } from "./wrap";

import { CoreClient, PolywrapClient } from "@polywrap/client-js";

export class Ethereum extends BaseEthereum {
  protected _getDefaultClient(): CoreClient {
    return new PolywrapClient();
  }
  protected _getDefaultUri(): string | undefined {
    return undefined;
  }
  protected _getDefaultEnv(): Record<string, unknown> | undefined {
    return undefined;
  }
}
