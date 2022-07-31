/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */

/// Types generated from @polywrap/ethereum-plugin-js build files:
/// build/index.d.ts, build/Connection.d.ts

export interface EthereumPluginConfig {
  networks: ConnectionConfigs;
  defaultNetwork?: string;
}

export interface ConnectionConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
}

export interface ConnectionConfigs {
  [network: string]: ConnectionConfig;
}

export type EthereumProvider = string | ExternalProvider | JsonRpcProvider;

export type EthereumSigner = Signer | Address | AccountIndex;

export type AccountIndex = number;

export type Address = string;

// import { Signer } from "ethers"
export type Signer = any;

// import { ExternalProvider } from "@ethersproject/providers"
export type ExternalProvider = any;

// import { JsonRpcProvider } from "@ethersproject/providers"
export type JsonRpcProvider = any;
