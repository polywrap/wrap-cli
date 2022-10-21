import { runCLI } from "./run-cli";

import {
  CommandTypes,
  CommandTypeMapping,
  BaseCommandOptions,
  CommandTypings,
} from "polywrap";

type CommandFn<
  TOptions extends BaseCommandOptions
> = (
  options?: TOptions,
  cwd?: string,
  cli?: string
) => ReturnType<typeof runCLI>;

type CommandFnWithArgs<
  TArguments extends unknown[],
  TOptions extends BaseCommandOptions
> = (
  ...args: [
    ...targs: TArguments,
    options?: TOptions,
    cwd?: string,
    cli?: string
  ]
) => ReturnType<typeof runCLI>;

type CommandFns<
  TCommands
> = Required<{
  [Command in keyof TCommands]:
    TCommands[Command] extends BaseCommandOptions ?
      CommandFn<TCommands[Command]> :
        TCommands[Command] extends CommandTypes ?
          CommandFnWithArgs<TCommands[Command]["arguments"], TCommands[Command]["options"]> :
            TCommands[Command] extends CommandTypeMapping ?
              CommandFns<TCommands[Command]> : never;
}>;

function execCommandFn<
  TOptions extends BaseCommandOptions,
>(command: string): CommandFn<TOptions> {
  return async (options?: Partial<TOptions>, cwd?: string, cli?: string) => {
    const parsedArgs = [
      ...command.split(" "),
      ...parseOptions(options)
    ];
    return await runCLI({
      args: parsedArgs, cwd, cli
    });
  };
}

function execCommandWithArgsFn<
  TTypes extends {
    options: BaseCommandOptions,
    arguments: unknown[]
  },
  TArguments extends unknown[] = TTypes["arguments"],
  TOptions extends BaseCommandOptions = TTypes["options"]
>(command: string): CommandFnWithArgs<TArguments, TOptions> {
  return async (...args: [...targs: TArguments, options?: Partial<TOptions>, cwd?: string, cli?: string]) => {
    const commandArgs = [];
    let options = {};
    let optionsFound = true;
    let cwd: string | undefined;
    let cwdFound = false;
    let cli: string | undefined;

    // Iterate through the variadic arguments
    for (const arg of args) {
      if (!optionsFound) {
        if (typeof arg === "string") {
          commandArgs.push(arg);
        } else if (arg === "object") {
          options = arg as Record<string, unknown>;
          optionsFound = true;
        } else if (typeof arg === "undefined") {
          // undefined options
          optionsFound = true;
        }
      } else {
        if (typeof arg !== "string" && typeof arg !== "undefined") {
          throw new Error(`Invalid "cwd" or "cli" argument type: ${arg}`);
        }
        if (!cwdFound) {
          cwd = arg;
          cwdFound = true;
        } else {
          cli = arg;
        }
      }
    }

    const parsedArgs = [
      ...command.split(" "),
      ...commandArgs,
      ...parseOptions(options)
    ];
    return await runCLI({
      args: parsedArgs, cwd, cli
    });
  }
}

export const commands: CommandFns<CommandTypings> = {
  build: execCommandFn<CommandTypings["build"]>("build"),
  codegen: execCommandFn<CommandTypings["codegen"]>("codegen"),
  create: {
    app: execCommandWithArgsFn<CommandTypings["create"]["app"]>("create app"),
    plugin: execCommandWithArgsFn<CommandTypings["create"]["plugin"]>("create plugin"),
    wasm: execCommandWithArgsFn<CommandTypings["create"]["wasm"]>("create wasm")
  },
  deploy: execCommandFn<CommandTypings["deploy"]>("deploy"),
  docgen: execCommandWithArgsFn<CommandTypings["docgen"]>("docgen"),
  infra: execCommandWithArgsFn<CommandTypings["infra"]>("infra"),
  manifest: {
    migrate: execCommandWithArgsFn<CommandTypings["manifest"]["migrate"]>("manifest migrate"),
    schema: execCommandWithArgsFn<CommandTypings["manifest"]["schema"]>("manifest schema")
  },
  run: execCommandFn<CommandTypings["run"]>("run"),
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
  options?: Partial<TOptions>
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
