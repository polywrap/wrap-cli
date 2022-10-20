import { runCLI } from "./run-cli";

import {
  CommandOptionMapping,
  BaseCommandOptions,
  CommandOptions,
} from "polywrap";

type CommandFn<
  TOptions extends BaseCommandOptions
> = (
  options?: TOptions,
  cwd?: string,
  cli?: string
) => ReturnType<typeof runCLI>;

type CommandFns<
  TCommands
> = Required<{
  [Command in keyof TCommands]:
    TCommands[Command] extends BaseCommandOptions ?
      CommandFn<TCommands[Command]> :
        TCommands[Command] extends CommandOptionMapping ?
          CommandFns<TCommands[Command]> : never;
}>;

function execCommandFn<
  TOptions extends BaseCommandOptions,
>(command: string): CommandFn<TOptions> {
  return async (options?: TOptions, cwd?: string, cli?: string) => {
    const args = [command, ...parseOptions(options)];
    return await runCLI({ args, cwd, cli });
  };
}

export const commands: CommandFns<CommandOptions> = {
  build: execCommandFn<CommandOptions["build"]>("build"),
  codegen: execCommandFn<CommandOptions["codegen"]>("codegen"),
  create: {
    app: execCommandFn<CommandOptions["create"]["app"]>("create app"),
    plugin: execCommandFn<CommandOptions["create"]["plugin"]>("create plugin"),
    wasm: execCommandFn<CommandOptions["create"]["wasm"]>("create wasm")
  },
  deploy: execCommandFn<CommandOptions["deploy"]>("deploy"),
  docgen: execCommandFn<CommandOptions["docgen"]>("docgen"),
  infra: execCommandFn<CommandOptions["infra"]>("infra"),
  manifest: {
    migrate: execCommandFn<CommandOptions["manifest"]["migrate"]>("manifest migrate"),
    schema: execCommandFn<CommandOptions["manifest"]["schema"]>("manifest schema")
  },
  run: execCommandFn<CommandOptions["run"]>("run"),
};

function toKebabCase(camelCase: string): string {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function parseValue(value: string | string[] | boolean): string {
  if (Array.isArray(value)) {
    return value.join(" ");
  }
  return value.toString();
}

function parseOptions<TOptions extends BaseCommandOptions>(
  options?: TOptions
): string[] {
  const parsed: string[] = [];
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined) continue;
      parsed.push(`--${toKebabCase(key)}`);
      parsed.push(parseValue(value));
    }
  }
  return parsed;
}
