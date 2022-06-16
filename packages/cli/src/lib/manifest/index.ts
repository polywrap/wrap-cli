export * from "./app";
export * from "./plugin";
export * from "./polywrap";
export * from "./language";
export * from "./output";

import {
  PolywrapManifest,
  PluginManifest,
  AppManifest,
} from "@polywrap/core-js";

export type AnyManifest = PolywrapManifest | PluginManifest | AppManifest;
