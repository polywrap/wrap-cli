import {
  CommandFn,
  CommandWithArgsFn,
  execCommandFn,
  execCommandWithArgsFn,
} from "./exec";

import {
  CommandTypes,
  CommandTypings,
  CommandTypeMapping,
  BaseCommandOptions,
} from "polywrap";

type CommandFns<TCommands> = Required<
  {
    [Command in keyof TCommands]: TCommands[Command] extends BaseCommandOptions
      ? CommandFn<TCommands[Command]>
      : TCommands[Command] extends CommandTypes
      ? CommandWithArgsFn<
          TCommands[Command]["arguments"],
          TCommands[Command]["options"]
        >
      : TCommands[Command] extends CommandTypeMapping
      ? CommandFns<TCommands[Command]>
      : never;
  }
>;

export const commands: CommandFns<CommandTypings> = {
  build: execCommandFn<CommandTypings["build"]>("build"),
  codegen: execCommandFn<CommandTypings["codegen"]>("codegen"),
  create: {
    app: execCommandWithArgsFn<CommandTypings["create"]["app"]>("create app"),
    plugin: execCommandWithArgsFn<CommandTypings["create"]["plugin"]>(
      "create plugin"
    ),
    wasm: execCommandWithArgsFn<CommandTypings["create"]["wasm"]>(
      "create wasm"
    ),
    template: execCommandWithArgsFn<CommandTypings["create"]["template"]>(
      "create template"
    ),
  },
  deploy: execCommandFn<CommandTypings["deploy"]>("deploy"),
  docgen: execCommandWithArgsFn<CommandTypings["docgen"]>("docgen"),
  infra: execCommandWithArgsFn<CommandTypings["infra"]>("infra"),
  manifest: {
    migrate: execCommandWithArgsFn<CommandTypings["manifest"]["migrate"]>(
      "manifest migrate"
    ),
    schema: execCommandWithArgsFn<CommandTypings["manifest"]["schema"]>(
      "manifest schema"
    ),
  },
  test: execCommandFn<CommandTypings["test"]>("test"),
};
