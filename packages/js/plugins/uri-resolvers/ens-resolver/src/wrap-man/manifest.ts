/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { wrapManifest } from "./wrap.info";

// @ts-ignore
import { PluginPackageManifest, Uri } from "@polywrap/core-js";

export const manifest: PluginPackageManifest = {
  abi: wrapManifest.abi,
  implements: [
    new Uri("ens/uri-resolver.core.polywrap.eth"),
  ],
};
