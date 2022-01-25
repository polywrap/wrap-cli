import { OutputDirectory, BindLanguage } from "../";
import * as WasmAs from "./wasm-as";
import * as PluginTs from "./plugin-ts";

import { Manifest, MetaManifest } from "@web3api/core-js";
import { TypeInfo } from "@web3api/schema-parse";

export function generateEntrypointBinding(
  bindLanguage: BindLanguage,
  typeInfo: TypeInfo,
  schema: string,
  manifest: Manifest,
  metaManifest?: MetaManifest,
): OutputDirectory {
  switch (bindLanguage) {
    case "plugin-ts":
      return PluginTs.generateEntrypointBinding(typeInfo, schema, manifest, metaManifest);
    default:
      throw new Error(`Unsupported bind language: ${bindLanguage}`);
  }
}

export function generateBinding(
  bindLanguage: BindLanguage,
  typeInfo: TypeInfo
): OutputDirectory {
  switch (bindLanguage) {
    case "wasm-as":
      return WasmAs.generateBinding(typeInfo);
    case "plugin-ts":
      return PluginTs.generateBinding(typeInfo);
    default:
      throw Error(`Error: Language binding unsupported - ${bindLanguage}`);
  }
}
