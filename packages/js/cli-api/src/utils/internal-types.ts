import { runCLI } from "../run-cli";
import {
  BuildCommandOptions,
  CodegenCommandOptions,
  CreateCommandOptions,
  DeployCommandOptions,
  DocgenCommandOptions,
  InfraCommandOptions,
  ManifestCommandOptions,
  RunCommandOptions,
} from "../types";

export type CommandNames = keyof CommandOptions;

export type ActionCommandNames = "docgen" | "infra";

export type CommandOptions = {
  build: BuildCommandOptions;
  codegen: CodegenCommandOptions;
  create: CreateCommandOptions;
  deploy: DeployCommandOptions;
  docgen: DocgenCommandOptions;
  infra: InfraCommandOptions;
  manifest: ManifestCommandOptions;
  run: RunCommandOptions;
};

export type Commands = {
  [Command in CommandNames]: (
    options?: CommandOptions[Command],
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;
};
