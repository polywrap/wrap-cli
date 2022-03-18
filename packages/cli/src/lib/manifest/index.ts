export * from "./app";
export * from "./plugin";
export * from "./web3api";
export * from "./language";
export * from "./output";

import { Web3ApiManifest, PluginManifest, AppManifest } from "@web3api/core-js";

export type AnyManifest = Web3ApiManifest | PluginManifest | AppManifest;
