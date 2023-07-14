export * from "./build";
export * from "./codegen";
export * from "./create";
export * from "./deploy";
export * from "./infra";
export * from "./manifest";
export * from "./test";
export * from "./types";
export * from "./docs";

import { BuildCommandOptions } from "./build";
import { CodegenCommandOptions } from "./codegen";
import {
  CreateCommandOptions,
  SupportedAppLangs,
  SupportedPluginLangs,
  SupportedWasmLangs,
} from "./create";
import { DeployCommandOptions } from "./deploy";
import { InfraCommandOptions, InfraActions } from "./infra";
import {
  ManifestSchemaCommandOptions,
  ManifestMigrateCommandOptions,
  ManifestType,
} from "./manifest";
import { TestCommandOptions } from "./test";
import { DocsInitCommandOptions } from "./docs";

export interface CommandTypings {
  build: BuildCommandOptions;
  codegen: CodegenCommandOptions;
  create: {
    app: {
      options: CreateCommandOptions;
      arguments: [language: SupportedAppLangs, name: string];
    };
    plugin: {
      options: CreateCommandOptions;
      arguments: [language: SupportedPluginLangs, name: string];
    };
    wasm: {
      options: CreateCommandOptions;
      arguments: [language: SupportedWasmLangs, name: string];
    };
    template: {
      options: CreateCommandOptions;
      arguments: [url: string, name: string];
    };
  };
  deploy: DeployCommandOptions;
  infra: {
    options: InfraCommandOptions;
    arguments: [action: `${InfraActions}`];
  };
  manifest: {
    migrate: {
      options: ManifestMigrateCommandOptions;
      arguments: [type: ManifestType];
    };
    schema: {
      options: ManifestSchemaCommandOptions;
      arguments: [type: ManifestType];
    };
  };
  test: TestCommandOptions;
  docs: {
    init: DocsInitCommandOptions;
  };
}
