import { Logger } from "../logging";

import { ImportedModuleDefinition } from "@polywrap/wrap-manifest-types-js";
import { PolywrapClient } from "@polywrap/client-js";

export interface WasmEmbed {
  uri: string;
  namespace: string;
  manifest: Uint8Array;
  module: Uint8Array;
}

export async function getWasmEmbeds(
  importedModules: ImportedModuleDefinition[],
  client: PolywrapClient,
  logger: Logger
): Promise<WasmEmbed[]> {
  const embeds: WasmEmbed[] = [];

  for (const importedModule of importedModules ?? []) {
    if (importedModule.isInterface) {
      continue;
    }
    const uri = importedModule.uri;

    const manifest = await client.getFile(uri, { path: "wrap.info" });
    if (!manifest.ok) {
      logger.error(JSON.stringify(manifest.error, null, 2));
      process.exit(1);
    }

    const module = await client.getFile(uri, { path: "wrap.wasm" });
    if (!module.ok) {
      // The error is ignored because getFile is expected to fail for plugins and interfaces
      continue;
    }

    embeds.push({
      uri,
      namespace: importedModule.namespace,
      manifest: manifest.value as Uint8Array,
      module: module.value as Uint8Array,
    });
  }

  return embeds;
}
