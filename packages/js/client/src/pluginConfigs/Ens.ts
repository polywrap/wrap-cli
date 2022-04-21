/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

/// Types generated from @web3api/ens-plugin-js build files:
/// build/w3-man/plugin.d.ts, build/query/index.d.ts

export interface EnsPluginConfigs {
  query: QueryConfig;
}

export interface QueryConfig extends Record<string, unknown> {
  addresses?: Addresses;
}

export interface Addresses {
  [network: string]: Address;
}

export type Address = string;
