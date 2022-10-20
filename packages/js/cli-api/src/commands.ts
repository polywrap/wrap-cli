import { runCLI } from "./run-cli";
import {
  Commands,
  CommandNames,
  CommandOptions,
  ActionCommandNames,
} from "./utils";
import { CreateCommandOptions, ManifestCommandOptions } from "./types";

export const commands: Commands = {
  build: simpleCommandExecutorFactory("build"),
  codegen: simpleCommandExecutorFactory("codegen"),
  create: createCommandExecutor,
  deploy: simpleCommandExecutorFactory("deploy"),
  docgen: actionCommandExecutorFactory("docgen"),
  infra: actionCommandExecutorFactory("infra"),
  manifest: manifestCommandExecutor,
  run: simpleCommandExecutorFactory("run"),
};

function toKebabCase(camelCase: string): string {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2");
}

function parseValue(value: string | string[] | boolean): string {
  if (Array.isArray(value)) {
    return value.join(" ");
  }
  return value.toString();
}

function parseOptions<Command extends CommandNames>(
  options?: CommandOptions[Command]
): string[] {
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

function simpleCommandExecutorFactory<Command extends CommandNames>(
  command: Command
) {
  return async (
    options?: CommandOptions[Command],
    cwd?: string,
    cli?: string
  ) => {
    const args = [command, ...parseOptions(options)];
    return await runCLI({ args, cwd, cli });
  };
}

function actionCommandExecutorFactory<Command extends ActionCommandNames>(
  command: Command
) {
  return async (
    options: CommandOptions[Command],
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
