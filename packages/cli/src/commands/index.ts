export * from "./build";
export * from "./codegen";
export * from "./create";
export * from "./deploy";
export * from "./docgen";
export * from "./infra";
export * from "./manifest";
export * from "./run";
export * from "./types";

import { BuildCommandOptions } from "./build";
import { CodegenCommandOptions } from "./codegen";
import {
  CreateAppCommandOptions,
  CreatePluginCommandOptions,
  CreateWasmCommandOptions
} from "./create";
import { DeployCommandOptions } from "./deploy";
import { DocgenCommandOptions } from "./docgen";
import { InfraCommandOptions } from "./infra";
import {
  ManifestSchemaCommandOptions,
  ManifestMigrateCommandOptions
} from "./manifest";
import { RunCommandOptions } from "./run";

export interface CommandOptions {
  "build": BuildCommandOptions;
  "codegen": CodegenCommandOptions;
  "create": {
    "app": CreateAppCommandOptions;
    "plugin": CreatePluginCommandOptions;
    "wasm": CreateWasmCommandOptions;
  };
  "deploy": DeployCommandOptions;
  "docgen": DocgenCommandOptions;
  "infra": InfraCommandOptions;
  "manifest": {
    "migrate": ManifestMigrateCommandOptions;
    "schema": ManifestSchemaCommandOptions;
  };
  "run": RunCommandOptions;
}
