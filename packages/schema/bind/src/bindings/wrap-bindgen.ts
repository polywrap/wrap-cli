import { BindOutput, BindOptions } from "../types";
import { Args_generateBindings, GenerateBindingFn, Output } from "./types";

import {
  PolywrapClient,
  ExtendableUriResolver,
  PolywrapClientConfigBuilder
} from "@polywrap/client-js";
import { OutputEntry } from "@polywrap/os-js";

export function getGenerateBindingFn(uri: string): GenerateBindingFn {
  return (options: BindOptions) => invokeBindgenWrap(uri, options);
}

async function invokeBindgenWrap(
  uri: string,
  options: BindOptions
): Promise<BindOutput> {
  // TODO: Can simplify if github resolver is added to a default config bundle
  const config = new PolywrapClientConfigBuilder()
    .addInterfaceImplementation(
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
      "wrap://ipfs/QmYPp2bQpRxR7WCoiAgWsWoiQzqxyFdqWxp1i65VW8wNv2"
    )
    .addDefaults()
    .build();

  const client = new PolywrapClient(config);
  const args: Args_generateBindings = {
    wrapInfo: {
      version: options.wrapInfo.version,
      name: options.wrapInfo.name,
      type: options.wrapInfo.type,
      abi: JSON.stringify(options.wrapInfo.abi),
    },
    context: options.config ? JSON.stringify(options.config) : undefined,
  };

  const result = await client.invoke<Output>({
    uri,
    method: "generateBindings",
    args: (args as unknown) as Record<string, unknown>,
  });
  if (!result.ok) throw result.error;
  const output = result.value;

  return {
    output: { entries: toOutputEntries(output) },
    outputDirAbs: options.outputDirAbs,
  };
}

function toOutputEntries(output: Output): OutputEntry[] {
  const entries: OutputEntry[] = [];
  output.files.forEach((file) => {
    entries.push({
      type: "File",
      name: file.name,
      data: file.data,
    });
  });
  output.dirs.forEach((dir) => {
    entries.push({
      type: "Directory",
      name: dir.name,
      data: toOutputEntries(dir),
    });
  });
  return entries;
}
