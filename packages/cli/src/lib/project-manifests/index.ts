export * from "./app";
export * from "./plugin";
export * from "./polywrap";
export * from "./language";
export * from "./output";

import {
  PolywrapManifest,
  PluginManifest,
  AppManifest,
} from "../";

export type AnyProjectManifest = PolywrapManifest | PluginManifest | AppManifest;
