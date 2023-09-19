import { defaultSchemaPath } from "../defaults";
import { isPluginManifestLanguage } from "./languages";

import fs from "fs";
import path from "path";
import { PluginManifest } from "@polywrap/polywrap-manifest-types-js";

export function applyPluginManifestDefaults(
  manifest: PluginManifest,
  manifestPath: string
): PluginManifest {
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
  if (!isPluginManifestLanguage(language)) {
    throw Error(`Unsupported language: ${language}`);
  }

  let relEntryPoint: string;
  if (language === "plugin/typescript") {
    relEntryPoint = "src/index.ts";
  } else if (language == "plugin/rust") {
    relEntryPoint = "Cargo.toml";
  } else if (language == "plugin/python") {
    relEntryPoint = "src/__init__.py";
  } else if (language == "plugin/swift") {
    relEntryPoint = "Package.swift";
  } else if (language == "plugin/kotlin") {
    relEntryPoint = "src/main/kotlin/Main.kt";
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
