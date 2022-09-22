import { clearStyle, polywrapCli } from "./utils";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import { runCLI } from "@polywrap/test-env-js";

const HELP = `Usage: polywrap manifest|m [options] [command]

Manifest commands

Options:
  -h, --help                  display help for command

Commands:
  schema|s [options] [type]   Prints out the schema for the current manifest
                              format.
  migrate|m [options] [type]  Migrates the polywrap project manifest to the
                              latest version.
  help [command]              display help for command
`;

const MIGRATE_HELP = `Usage: polywrap manifest migrate|m [options] [type]

Migrates the polywrap project manifest to the latest version.

Arguments:
  type                        Type of manifest file to migrate (default:
                              project) (choices: "project", "build", "deploy",
                              "infra", "meta", "workflow", default: "project")

Options:
  -m, --manifest-file <path>  Path to the manifest file (default: polywrap.yaml
                              | polywrap.yml | polywrap.app.yaml |
                              polywrap.app.yml | polywrap.plugin.yaml |
                              polywrap.plugin.yml)
  -h, --help                  display help for command
`;

const SCHEMA_HELP = `Usage: polywrap manifest schema|s [options] [type]

Prints out the schema for the current manifest format.

Arguments:
  type                        Type of manifest file to migrate (default:
                              project) (choices: \"project\", \"build\", \"deploy\",
                              \"infra\", \"meta\", \"workflow\", default: \"project\")

Options:
  -r, --raw                   Output raw JSON Schema (default: false)
  -m, --manifest-file <path>  Path to the manifest file (default: polywrap.yaml
                              | polywrap.yml | polywrap.app.yaml |
                              polywrap.app.yml | polywrap.plugin.yaml |
                              polywrap.plugin.yml)
  -h, --help                  display help for command
`;

describe("e2e tests for manifest command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "manifest");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["manifest", "--help"],
      cwd: testCaseRoot,
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  describe("migrate command", () => {
    test("Should show help text", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "migrate", "--help"],
        cwd: testCaseRoot,
        cli: polywrapCli,
      });

      expect(clearStyle(output)).toEqual(MIGRATE_HELP);
      expect(error).toBe("");
      expect(code).toEqual(0);
    });

    describe("options", () => {
      it("Should throw error for unknown option --invalid", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "--invalid"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe("error: unknown option '--invalid'\n");
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });

      it("Should throw error if params not specified for --manifest-file option", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "-m"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: option '-m, --manifest-file <path>' argument missing\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });

    describe("arguments", () => {
      it("Should throw error if 'type' argument is invalid", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "invalid-arg"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: command-argument value 'invalid-arg' is invalid for argument 'type'. Allowed choices are project, build, deploy, infra, meta, workflow.\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });
  });

  describe("schema command", () => {
    test("Should show help text", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "--help"],
        cwd: testCaseRoot,
        cli: polywrapCli,
      });

      expect(clearStyle(output)).toEqual(SCHEMA_HELP);
      expect(error).toBe("");
      expect(code).toEqual(0);
    });

    describe("options", () => {
      it("Should throw error for unknown option --invalid", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "--invalid"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe("error: unknown option '--invalid'\n");
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });

      it("Should throw error if params not specified for --manifest-file option", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "-m"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: option '-m, --manifest-file <path>' argument missing\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });

    describe("arguments", () => {
      it("Should throw error if 'type' argument is invalid", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "invalid-arg"],
          cwd: testCaseRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: command-argument value 'invalid-arg' is invalid for argument 'type'. Allowed choices are project, build, deploy, infra, meta, workflow.\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });

    test("Should throw on invalid format within file", async () => {
      const manifestFile = path.join(testCaseRoot, "samples", "invalid-format.yaml");
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "-m", manifestFile],
        cwd: testCaseRoot,
        cli: polywrapCli,
      });

      expect(error).toContain("Unsupported manifest format. Please make sure that you have the 'format' field present in samples/invalid-format.yaml with one of the following values:");
      expect(output).toBe("");
      expect(code).toEqual(1);
    });
  });
});
