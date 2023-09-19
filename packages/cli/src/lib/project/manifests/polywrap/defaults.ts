import { isPolywrapManifestLanguage } from "./languages";
import { defaultSchemaPath } from "../defaults";

import fs from "fs";
import path from "path";
import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

export function applyPolywrapManifestDefaults(
  manifest: PolywrapManifest,
  manifestPath: string
): PolywrapManifest {
  if (!manifest.source.module) {
    const language = manifest.project.type;
    manifest.source.module = defaultModulePath(language, manifestPath);
  }
  if (!manifest.source.schema) {
    manifest.source.schema = defaultSchemaPath(manifestPath);
  }
  return manifest;
}

function defaultModulePath(
  language: string,
  manifestPath: string
): string | undefined {
  if (!isPolywrapManifestLanguage(language)) {
    throw Error(`Unsupported language: ${language}`);
  }

  let relEntryPoint: string;
  if (language === "wasm/typescript" || language === "wasm/assemblyscript") {
    relEntryPoint = "src/index.ts";
  } else if (language == "wasm/rust") {
    relEntryPoint = "Cargo.toml";
  } else if (language == "wasm/golang") {
    relEntryPoint = "go.mod";
  } else if (language == "interface") {
    return undefined;
  } else {
    throw Error(`Unsupported language: ${language}`);
  }

  const absEntryPoint = path.resolve(manifestPath, relEntryPoint);
  if (fs.existsSync(absEntryPoint)) {
    return absEntryPoint;
  }

  throw Error(
    "Couldn't find module entry point in default paths. Please specify the module entry point in the project manifest."
  );
}
