import {
  BuildCommandOptions as ParsedBuildCommandOptions,
  CodegenCommandOptions as ParsedCodegenCommandOptions,
  CreateCommandOptions as ParsedCreateCommandOptions,
  DeployCommandOptions as ParsedDeployCommandOptions,
  DocgenCommandOptions as ParsedDocgenCommandOptions,
  InfraCommandOptions as ParsedInfraCommandOptions,
  ManifestMigrateCommandOptions as ParsedManifestMigrateCommandOptions,
  ManifestSchemaCommandOptions as ParsedManifestSchemaCommandOptions,
  RunCommandOptions as ParsedRunCommandOptions,
  SupportedWasmLangs,
  SupportedPluginLangs,
  SupportedAppLangs,
  DocgenActions,
  InfraActions,
  SupportedStrategies,
  ManifestType,
} from "polywrap";

export {
  DocgenActions,
  InfraActions,
  SupportedStrategies as BuildStrategies,
} from "polywrap";

export type DocgenAction = `${DocgenActions}`;
export type InfraAction = `${InfraActions}`;
export type BuildStrategy = `${SupportedStrategies}`;

export type DeployCommandOptions = Partial<ParsedDeployCommandOptions>;

export type BuildCommandOptions = Omit<
  Partial<ParsedBuildCommandOptions>,
  "watch" | "clientConfig" | "strategy"
> & {
  clientConfig?: string;
  strategy?: BuildStrategy;
};

export type CodegenCommandOptions = Omit<
  Partial<ParsedCodegenCommandOptions>,
  "clientConfig"
> & {
  clientConfig?: string;
};

export type RunCommandOptions = Omit<
  Partial<ParsedRunCommandOptions>,
  "clientConfig"
> & {
  clientConfig?: string;
};

// create

export type CreateWasmCommandArgs = {
  command: "wasm";
  language: SupportedWasmLangs;
  name: string;
};

export type CreatePluginCommandArgs = {
  command: "plugin";
  language: SupportedPluginLangs;
  name: string;
};

export type CreateAppCommandArgs = {
  command: "app";
  language: SupportedAppLangs;
  name: string;
};

export type CreateCommandArgs =
  | CreateWasmCommandArgs
  | CreatePluginCommandArgs
  | CreateAppCommandArgs;

export type CreateCommandOptions = CreateCommandArgs &
  Partial<ParsedCreateCommandOptions>;

// docgen

export type DocgenCommandArgs = {
  action: DocgenAction;
};

export type DocgenCommandOptions = DocgenCommandArgs &
  Omit<Partial<ParsedDocgenCommandOptions>, "clientConfig"> & {
    clientConfig?: string;
  };

// infra

export type InfraCommandArgs = {
  action: InfraAction;
};

export type InfraCommandOptions = InfraCommandArgs &
  Partial<ParsedInfraCommandOptions>;

// manifest

export type ManifestSchemaCommandArgs = {
  command: "schema";
  type: ManifestType;
};

export type ManifestMigrateCommandArgs = {
  command: "migrate";
  type: ManifestType;
};

export type ManifestSchemaCommandOptions = Partial<ParsedManifestSchemaCommandOptions>;

export type ManifestMigrateCommandOptions = Partial<ParsedManifestMigrateCommandOptions>;

export type ManifestCommandOptions =
  | (ManifestSchemaCommandArgs & ManifestSchemaCommandOptions)
  | (ManifestMigrateCommandArgs & ManifestMigrateCommandOptions);
