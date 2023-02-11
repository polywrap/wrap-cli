import { Commands, CliConfig } from "../../";

import {
  CommandTypes,
  CommandTypings,
  CommandTypeMapping,
  BaseCommandOptions,
} from "polywrap";
import { 
  initTestEnvironment,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import os from "os";
import path from "path";

jest.setTimeout(300_000);

type CommandTestCase<TOptions> = CliConfig & {
  options?: Partial<TOptions>;
  before?: (test: CommandTestCase<TOptions>) => Promise<void> | void;
  after: (
    test: CommandTestCase<TOptions>,
    stdout: string,
    stderr: string,
    exitCode: number
  ) => Promise<void> | void;
};

type CommandTestCases<TOptions> = CommandTestCase<TOptions>[];

type CommandTestCasesWithArgs<TArgs, TOptions> =
  (CommandTestCase<TOptions> &
  { arguments: TArgs; })[];

type CommandTestCaseData<
  TCommands
> = Required<{
  [Command in keyof TCommands]:
    TCommands[Command] extends BaseCommandOptions ?
      CommandTestCases<TCommands[Command]> :
        TCommands[Command] extends CommandTypes ?
          CommandTestCasesWithArgs<TCommands[Command]["arguments"], TCommands[Command]["options"]> :
            TCommands[Command] extends CommandTypeMapping ?
              CommandTestCaseData<TCommands[Command]> : never;
}>;

const clearDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
  expect(fs.existsSync(dir)).toBeFalsy();
}

const testData: CommandTestCaseData<CommandTypings> = {
  build: [{
    options: { strategy: "vm" },
    cwd: path.join(GetPathToCliTestFiles(), "wasm/build-cmd/assemblyscript/001-sanity"),
    before: async (test) => {
      // clear build dir
      if (!test.cwd) throw Error("This shouldn't happen");
      clearDir(path.join(test.cwd, "build"));
    },
    after: (test) => {
      // check for build dir and artifacts
      if (!test.cwd) throw Error("This shouldn't happen");
      const buildDir = path.join(test.cwd, "build");
      const wasmPath = path.join(buildDir, "wrap.wasm");
      const manifestPath = path.join(buildDir, "wrap.info");
      expect(fs.existsSync(buildDir)).toBeTruthy();
      expect(fs.existsSync(wasmPath)).toBeTruthy();
      expect(fs.existsSync(manifestPath)).toBeTruthy();
    }
  }],
  codegen: [{
    options: { codegenDir: "./test" },
    cwd: path.join(GetPathToCliTestFiles(), "wasm/codegen/001-sanity-assemblyscript"),
    before: (test) => {
      // clear build dir
      if (!test.cwd || !test.options?.codegenDir)
        throw Error("This shouldn't happen");
      const outputDir = path.join(test.cwd, test.options?.codegenDir);
      clearDir(outputDir);
    },
    after: (test) => {
      // check for build dir and artifacts
      if (!test.cwd || !test.options?.codegenDir)
        throw Error("This shouldn't happen");
      const outputDir = path.join(test.cwd, test.options?.codegenDir);
      expect(fs.existsSync(outputDir)).toBeTruthy();
      clearDir(outputDir);
    }
  }],
  create: {
    app: [{
      cwd: fs.mkdtempSync(path.join(os.tmpdir(), "cli-js-create-test")),
      arguments: ["typescript", "test-app"],
      after: (test) => {
        if (!test.cwd)
          throw Error("This shouldn't happen");
        const outputDir = path.join(test.cwd, "test-app");
        const packagePath = path.join(outputDir, "package.json");
        expect(fs.existsSync(outputDir)).toBeTruthy();
        expect(fs.existsSync(packagePath)).toBeTruthy();
        clearDir(test.cwd);
      }
    }],
    plugin: [{
      cwd: fs.mkdtempSync(path.join(os.tmpdir(), "cli-js-create-test")),
      arguments: ["typescript", "test-plugin"],
      after: (test) => {
        if (!test.cwd)
          throw Error("This shouldn't happen");
        const outputDir = path.join(test.cwd, "test-plugin");
        const packagePath = path.join(outputDir, "package.json");
        expect(fs.existsSync(outputDir)).toBeTruthy();
        expect(fs.existsSync(packagePath)).toBeTruthy();
        clearDir(test.cwd);
      }
    }],
    wasm: [{
      cwd: fs.mkdtempSync(path.join(os.tmpdir(), "cli-js-create-test")),
      arguments: ["rust", "test-wasm"],
      after: (test, stdout, stderr, exitCode) => {
        if (!test.cwd)
          throw Error("This shouldn't happen");
        const outputDir = path.join(test.cwd, "test-wasm");
        const packagePath = path.join(outputDir, "Cargo.toml");
        expect(fs.existsSync(outputDir)).toBeTruthy();
        expect(fs.existsSync(packagePath)).toBeTruthy();
        clearDir(test.cwd);
      }
    }]
  },
  deploy: [{
    cwd: path.join(GetPathToCliTestFiles(), "wasm/deploy/001-sanity"),
    env: {
      PATH: process.env.PATH || "",
      IPFS_GATEWAY_URI: providers.ipfs,
      DOMAIN_NAME: "test1.eth",
      ENS_REG_ADDR: ensAddresses.ensAddress,
      ENS_REGISTRAR_ADDR: ensAddresses.registrarAddress,
      ENS_RESOLVER_ADDR: ensAddresses.resolverAddress,
    },
    before: async () => {
      await stopTestEnvironment();
      await initTestEnvironment();

      // Wait a little longer just in case
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
    after: async (_, stdout) => {
      expect(stdout).toContain(
        "Successfully executed"
      );
      await stopTestEnvironment();
    }
  }],
  docgen: [{
    cwd: path.join(GetPathToCliTestFiles(), "docgen", "001-sanity"),
    arguments: ["docusaurus"],
    after: (_, stdout) => {
      expect(stdout).toContain("Docs were generated successfully");
    }
  }],
  infra: [{
    cwd: path.join(GetPathToCliTestFiles(), "infra/001-sanity"),
    env: {
      PATH: process.env.PATH || "",
      ENV_IPFS_PORT: "5001",
    },
    arguments: ["config"],
    after: (_, stdout) => {
      expect(stdout).toContain("services:");
    }
  }],
  manifest: {
    migrate: [{
      cwd: fs.mkdtempSync(path.join(os.tmpdir(), "manifest-migrate")),
      arguments: ["project"],
      before: (test) => {
        if (!test.cwd)
          throw Error("This shouldn't happen");
        fs.copyFileSync(
          path.join(GetPathToCliTestFiles(), "manifest/samples/polywrap.yaml"),
          path.join(test.cwd, "polywrap.yaml")
        );
      },
      after: (_, stdout, __, exitCode) => {
        expect(stdout).toContain("Migrating polywrap.yaml to version");
        expect(exitCode).toBe(0);
      }
    }],
    schema: [{
      cwd: path.join(GetPathToCliTestFiles(), "manifest/samples"),
      arguments: ["build"],
      after: (_, stdout) => {
        expect(stdout).toContain("format: ");
      }
    }]
  },
  test: [{
    cwd: path.join(GetPathToCliTestFiles(), "test/001-yaml-workflow"),
    before: async (test) => {
      if (!test.cwd)
        throw Error("This shouldn't happen");
      const wrapperPath = path.join(test.cwd, "../run-test-wrapper");
      await Commands.build({}, { cwd: wrapperPath });
    },
    after: (_, stdout, __, exitCode) => {
      expect(stdout).toContain("Data: ");
      expect(exitCode).toBe(0);
    }
  }]
};

describe("Commands", () => {
  const resolvePropPath = (props: string[], obj: any) => {
    let resolved = obj;
    for (const prop of props) {
      if (!resolved) {
        return undefined;
      }
      resolved = resolved[prop];
    }
    return resolved;
  }

  const runCommandTests = (props: string[]) => {
    const command = resolvePropPath(props, Commands);

    if (!command) {
      throw Error(`Invalid command path: ${props.join(".")}`);
    }

    if (
      typeof command !== "function" &&
      typeof command === "object"
    ) {
      for (const prop of Object.keys(command)) {
        runCommandTests([...props, prop]);
      }
    }

    describe(props.join("."), () => {
      const tests =
        resolvePropPath(props, testData) as
        CommandTestCasesWithArgs<unknown[], unknown>;

      if (!tests) {
        throw Error(`Test data for Commands.${props.join(".")} not defined.`);
      }

      for (let i = 0; i < tests.length; ++i) {
        let test = tests[i];

        it(`test #${i}`, async () => {
          let result: {
            exitCode: number;
            stdout: string;
            stderr: string;
          };
          const cliConfig = {
            cwd: test.cwd,
            cli: test.cli,
            env: test.env
          };

          if (test.before) {
            await test.before(test);
          }

          if (test.arguments) {
            result = await command(...test.arguments, test.options, cliConfig);
          } else {
            result = await command(test.options, cliConfig);
          }

          await test.after(
            test,
            result.stdout,
            result.stderr,
            result.exitCode
          );
        });
      }
    });
  }

  for (const command of Object.keys(Commands)) {
    runCommandTests([command]);
  }
});
