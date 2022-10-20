import { runCLI } from "./run-cli";
import {
  BuildCommandOptions,
  CodegenCommandOptions,
  CreateCommandOptions,
  DeployCommandOptions,
  DocgenCommandOptions,
  InfraCommandOptions,
  ManifestCommandOptions,
  RunCommandOptions,
} from "./types";

export interface ICommands {
  readonly build: (
    options?: BuildCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly codegen: (
    options?: CodegenCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly create: (
    options: CreateCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly deploy: (
    options?: DeployCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly docgen: (
    options: DocgenCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly infra: (
    options: InfraCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly manifest: (
    options: ManifestCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;

  readonly run: (
    options?: RunCommandOptions,
    cwd?: string,
    cli?: string
  ) => ReturnType<typeof runCLI>;
}
