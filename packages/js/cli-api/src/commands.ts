import { runCLI } from "./run-cli";
import { ICommands } from "./utils";
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

export const commands: ICommands = {
  build: simpleCommandExecutorFactory("build"),
  codegen: simpleCommandExecutorFactory("codegen"),
  create: createCommandExecutor,
  deploy: simpleCommandExecutorFactory("deploy"),
  docgen: actionCommandExecutorFactory("docgen"),
  infra: actionCommandExecutorFactory("infra"),
  manifest: manifestCommandExecutor,
  run: simpleCommandExecutorFactory("run"),
};

type CommandOptions =
  | BuildCommandOptions
  | CodegenCommandOptions
  | CreateCommandOptions
  | DeployCommandOptions
  | DocgenCommandOptions
  | InfraCommandOptions
  | ManifestCommandOptions
  | RunCommandOptions;

function toKebabCase(camelCase: string): string {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2");
}

function parseValue(value: string | string[] | boolean): string {
  if (Array.isArray(value)) {
    return value.join(" ");
  }
  return value.toString();
}

function parseOptions(options?: CommandOptions): string[] {
  const parsed: string[] = [];
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined) continue;
      parsed.push(toKebabCase(key));
      parsed.push(parseValue(value));
    }
  }
  return parsed;
}

function simpleCommandExecutorFactory(command: string) {
  return async (options?: CommandOptions, cwd?: string, cli?: string) => {
    const args = [command, ...parseOptions(options)];
    return await runCLI({ args, cwd, cli });
  };
}

function actionCommandExecutorFactory(command: string) {
  return async (
    options: InfraCommandOptions | DocgenCommandOptions,
    cwd?: string,
    cli?: string
  ) => {
    const { action, ...cmdOptions } = options;
    const args = [command, action, ...parseOptions(cmdOptions)];
    return await runCLI({ args, cwd, cli });
  };
}

async function createCommandExecutor(
  options: CreateCommandOptions,
  cwd?: string,
  cli?: string
): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const { command, language, name, ...createOpts } = options;
  const args = ["create", command, language, name, ...parseOptions(createOpts)];
  return await runCLI({ args, cwd, cli });
}

async function manifestCommandExecutor(
  options: ManifestCommandOptions,
  cwd?: string,
  cli?: string
): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const { command, type, ...manifestOptions } = options;
  const args = ["manifest", command, type, ...parseOptions(manifestOptions)];
  return await runCLI({ args, cwd, cli });
}
