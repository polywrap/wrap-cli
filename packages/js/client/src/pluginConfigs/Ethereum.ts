/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

/// Types generated from build/index.d.ts

export interface EthereumConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
}

export type EthereumProvider = string | ExternalProvider;

export type EthereumSigner = Signer | Address | AccountIndex;

export type AccountIndex = number;

export type Address = string;

// import { Signer } from "ethers"
export type Signer = any;

// import { ExternalProvider } from "@ethersproject/providers"
export type ExternalProvider = any;