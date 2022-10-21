import { runCli, CliConfig } from "../run-cli";

import { BaseCommandOptions } from "polywrap";

export type CommandFn<
  TOptions extends BaseCommandOptions
> = (
  options?: Partial<TOptions>,
  config?: CliConfig
) => ReturnType<typeof runCli>;

export type CommandWithArgsFn<
  TArguments extends unknown[],
  TOptions extends BaseCommandOptions
> = (
  ...args: [
    ...targs: TArguments,
    options?: Partial<TOptions>,
    config?: CliConfig
  ]
) => ReturnType<typeof runCli>;

export function execCommandFn<
  TOptions extends BaseCommandOptions,
>(command: string): CommandFn<TOptions> {
  return async (options?: Partial<TOptions>, config?: CliConfig) => {
    const parsedArgs = [
      ...command.split(" "),
      ...parseOptions(options)
    ];
    return await runCli({
      args: parsedArgs, config
    });
  };
}

export function execCommandWithArgsFn<
  TTypes extends {
    options: BaseCommandOptions,
    arguments: unknown[]
  },
  TArguments extends unknown[] = TTypes["arguments"],
  TOptions extends BaseCommandOptions = TTypes["options"]
>(command: string): CommandWithArgsFn<TArguments, TOptions> {
  return async (...args: [...targs: TArguments, options?: Partial<TOptions>, config?: CliConfig]) => {
    const commandArgs = [];
    let options = {};
    let optionsFound = false;
    let config: CliConfig | undefined = { };

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
        if (typeof arg !== "object" && typeof arg !== "undefined") {
          throw new Error(`Invalid CliConfig argument type: ${arg}`);
        }
        config = arg as CliConfig | undefined;
        break;
      }
    }

    const parsedArgs = [
      ...command.split(" "),
      ...commandArgs,
      ...parseOptions(options)
    ];
    return await runCli({
      args: parsedArgs, config
    });
  }
}

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
