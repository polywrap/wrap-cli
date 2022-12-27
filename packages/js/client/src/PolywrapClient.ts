import { PolywrapClientConfig } from "./PolywrapClientConfig";
import { buildPolywrapCoreClientConfig } from "./buildPolywrapCoreClientConfig";

import {
  PolywrapCoreClient,
  PolywrapCoreClientConfig,
} from "@polywrap/core-client-js";

export class PolywrapClient extends PolywrapCoreClient {
  // $start: PolywrapClient-constructor
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a whole or partial client configuration
   * @param options - { noDefaults?: boolean }
   */
  constructor(
    config?: Partial<PolywrapClientConfig>,
    options?: { noDefaults?: false }
  );
  constructor(config: PolywrapCoreClientConfig, options: { noDefaults: true });
  constructor(
    config:
      | Partial<PolywrapClientConfig>
      | undefined
      | PolywrapCoreClientConfig,
    options?: { noDefaults?: boolean }
    // $end
  ) {
    super(
      !options?.noDefaults
        ? buildPolywrapCoreClientConfig(
            config as PolywrapClientConfig | undefined
          )
        : (config as PolywrapCoreClientConfig)
    );
  }
}
