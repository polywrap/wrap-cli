export * from "./build";
export * from "./codegen";
export * from "./create";
export * from "./deploy";
export * from "./docgen";
export * from "./infra";
export * from "./manifest";
export * from "./test";
export * from "./types";

import { BuildCommandOptions } from "./build";
import { CodegenCommandOptions } from "./codegen";
import {
  CreateCommandOptions,
  SupportedAppLangs,
  SupportedPluginLangs,
  SupportedWasmLangs
} from "./create";
import { DeployCommandOptions } from "./deploy";
import {
  DocgenCommandOptions,
  DocgenActions
} from "./docgen";
import {
  InfraCommandOptions,
  InfraActions
} from "./infra";
import {
  ManifestSchemaCommandOptions,
  ManifestMigrateCommandOptions,
  ManifestType
} from "./manifest";
import { TestCommandOptions } from "./test";

export interface CommandTypings {
  "build": BuildCommandOptions;
  "codegen": CodegenCommandOptions;
  "create": {
    "app": {
      options: CreateCommandOptions;
      arguments: [language: SupportedAppLangs, name: string];
    };
    "plugin": {
      options: CreateCommandOptions;
      arguments: [language: SupportedPluginLangs, name: string];
    };
    "wasm": {
      options: CreateCommandOptions;
      arguments: [language: SupportedWasmLangs, name: string];
    };
  };
  "deploy": DeployCommandOptions;
  "docgen": {
    options: DocgenCommandOptions;
    arguments: [action: `${DocgenActions}`];
  };
  "infra": {
    options: InfraCommandOptions;
    arguments: [action: `${InfraActions}`];
  };
  "manifest": {
    "migrate": {
      options: ManifestMigrateCommandOptions;
      arguments: [type: ManifestType];
    };
    "schema": {
      options: ManifestSchemaCommandOptions;
      arguments: [type: ManifestType];
    };
  };
  "test": TestCommandOptions;
}
