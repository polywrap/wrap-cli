/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

/// Types generated from @polywrap/ens-resolver-plugin-js build files:
/// build/index.d.ts

export interface EnsResolverPluginConfig extends Record<string, unknown> {
  addresses?: Addresses;
}

export interface Addresses {
  [network: string]: Address;
}

export type Address = string;
