import { clearStyle, polywrapCli } from "./utils";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import rimraf from "rimraf";
import { runCLI } from "@polywrap/test-env-js";

const HELP = `Usage: polywrap manifest|m [options] [command]

Inspect & Migrade Polywrap Manifests

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
                              "infra", "workflow", default: "project")

Options:
  -m, --manifest-file <path>  Path to the manifest file (default: polywrap.yaml
                              | polywrap.yml)
  -f, --format <format>       Target format to migrate to (defaults to latest)
  -l, --log-file [path]       Log file to save console output to
  -v, --verbose               Verbose output (default: false)
  -q, --quiet                 Suppress output (default: false)
  -h, --help                  display help for command
`;

const SCHEMA_HELP = `Usage: polywrap manifest schema|s [options] [type]

Prints out the schema for the current manifest format.

Arguments:
  type                        Type of manifest file to migrate (default:
                              project) (choices: \"project\", \"build\", \"deploy\",
                              \"infra\", \"workflow\", default: \"project\")

Options:
  -r, --raw                   Output raw JSON Schema
  -m, --manifest-file <path>  Path to the manifest file (default: polywrap.yaml
                              | polywrap.yml)
  -v, --verbose               Verbose output (default: false)
  -q, --quiet                 Suppress output (default: false)
  -l, --log-file [path]       Log file to save console output to
  -h, --help                  display help for command
`;

describe("e2e tests for manifest command", () => {
  const testsRoot = path.join(GetPathToCliTestFiles(), "manifest");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["manifest", "--help"],
      cwd: testsRoot,
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
        cwd: testsRoot,
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
          cwd: testsRoot,
          cli: polywrapCli,
        });

        expect(error).toBe("error: unknown option '--invalid'\n");
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });

      it("Should throw error if params not specified for --manifest-file option", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "-m"],
          cwd: testsRoot,
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
          cwd: testsRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: command-argument value 'invalid-arg' is invalid for argument 'type'. Allowed choices are project, build, deploy, infra, workflow.\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });

    describe("actions", () => {
      const validSampleProjectManifestFiles: Record<string, string> = {
        wasm: "polywrap.yaml",
        app: "polywrap.app.yaml",
        plugin: "polywrap.plugin.yaml",
      };

      const validSampleExtensionManifestFiles: Record<string, string> = {
        build: "polywrap.build.yaml",
        deploy: "polywrap.deploy.yaml",
        infra: "polywrap.infra.yaml",
        workflow: "polywrap.test.yaml",
      };

      const tempDir = path.join(testsRoot, "temp");

      beforeAll(async () => {
        const samplesDir = path.join(testsRoot, "samples");

        if (fs.existsSync(tempDir)) {
          rimraf.sync(tempDir);
        }

        await fse.copy(samplesDir, tempDir);
      });

      afterAll(async () => {
        if (fs.existsSync(tempDir)) {
          rimraf.sync(tempDir);
        }
      });

      for (const projectType in validSampleProjectManifestFiles) {
        const manifestFile = validSampleProjectManifestFiles[projectType];

        test(`Should migrate ${projectType} project manifest`, async () => {
          const {
            exitCode: code,
            stdout: output,
            stderr: error,
          } = await runCLI({
            args: ["manifest", "migrate", "-m", manifestFile],
            cwd: tempDir,
            cli: polywrapCli,
          });

          expect(output).toContain(`Migrating ${manifestFile} to version`);
          expect(output).toContain(
            `Saved previous version of manifest to .polywrap/manifest/${manifestFile}`
          );
          expect(error).toBe("");
          expect(code).toBe(0);

          const oldFile = path.join(
            tempDir,
            ".polywrap",
            "manifest",
            manifestFile
          );
          const oldFileExists = fs.existsSync(oldFile);

          expect(oldFileExists).toBeTruthy();
        });

        test(`Should display error when invalid target format is provided for ${projectType} project manifest`, async () => {
          const {
            exitCode: code,
            stdout: output,
            stderr: error,
          } = await runCLI({
            args: ["manifest", "migrate", "-m", manifestFile, "-f", "INVALID_MANIFEST_FORMAT"],
            cwd: tempDir,
            cli: polywrapCli,
          });

          expect(output).toBe("");
          expect(error).toContain("Unsupported target format. Supported formats:");
          expect(code).toBe(1);
        });
      }

      for (const extensionType in validSampleExtensionManifestFiles) {
        const manifestFile = validSampleExtensionManifestFiles[extensionType];

        test(`Should migrate ${extensionType} extension manifest`, async () => {
          const {
            exitCode: code,
            stdout: output,
            stderr: error,
          } = await runCLI({
            args: ["manifest", "migrate", extensionType, "-m", manifestFile],
            cwd: tempDir,
            cli: polywrapCli,
          });

          expect(output).toContain(`Migrating ${manifestFile} to version`);
          expect(output).toContain(
            `Saved previous version of manifest to .polywrap/manifest/${manifestFile}`
          );
          expect(error).toBe("");
          expect(code).toBe(0);

          const oldFile = path.join(
            tempDir,
            ".polywrap",
            "manifest",
            manifestFile
          );
          const oldFileExists = fs.existsSync(oldFile);

          expect(oldFileExists).toBeTruthy();
        });

        test(`Should display error when invalid target format is provided for ${extensionType} extension manifest`, async () => {
          const {
            exitCode: code,
            stdout: output,
            stderr: error,
          } = await runCLI({
            args: ["manifest", "migrate", extensionType, "-m", manifestFile, "-f", "INVALID_MANIFEST_FORMAT"],
            cwd: tempDir,
            cli: polywrapCli,
          });

          expect(output).toBe("");
          expect(error).toContain("Unsupported target format. Supported formats:");
          expect(code).toBe(1);
        });
      }
    });
  });

  describe("Schema command", () => {
    test("Should show help text", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "--help"],
        cwd: testsRoot,
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
          cwd: testsRoot,
          cli: polywrapCli,
        });

        expect(error).toBe("error: unknown option '--invalid'\n");
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });

      it("Should throw error if params not specified for --manifest-file option", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["manifest", "migrate", "-m"],
          cwd: testsRoot,
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
          cwd: testsRoot,
          cli: polywrapCli,
        });

        expect(error).toBe(
          `error: command-argument value 'invalid-arg' is invalid for argument 'type'. Allowed choices are project, build, deploy, infra, workflow.\n`
        );
        expect(output).toEqual(``);
        expect(code).toEqual(1);
      });
    });

    test("Should throw on invalid format within file", async () => {
      const manifestFile = path.join(
        testsRoot,
        "samples",
        "invalid-format.yaml"
      );
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "-m", manifestFile],
        cwd: testsRoot,
        cli: polywrapCli,
      });

      expect(error).toContain(
        "Unsupported manifest format. Please make sure that you have the 'format' field present in samples/invalid-format.yaml with one of the following values:"
      );
      expect(output).toBe("");
      expect(code).toEqual(1);
    });

    test("Should output a YAML-ish schema", async () => {
      const manifestFile = path.join(testsRoot, "samples", "polywrap.yaml");
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "-m", manifestFile],
        cwd: testsRoot,
        cli: polywrapCli,
      });

      expect(output).toContain("format:  #");
      expect(error).toBe("");
      expect(code).toEqual(0);
    });

    test("Should output a raw schema", async () => {
      const manifestFile = path.join(testsRoot, "samples", "polywrap.yaml");
      const { exitCode: code, stdout: output, stderr: error } = await runCLI({
        args: ["manifest", "schema", "-m", manifestFile, "--raw"],
        cwd: testsRoot,
        cli: polywrapCli,
      });

      const schemasPackageDir = path.dirname(
        require.resolve("@polywrap/polywrap-manifest-schemas")
      );

      const originalSchemaFile = path.join(
        schemasPackageDir,
        "formats",
        "polywrap",
        "0.1.0.json"
      );
      const originalSchema = fs.readFileSync(originalSchemaFile, {
        encoding: "utf-8",
      });

      expect(output).toContain(originalSchema);
      expect(error).toBe("");
      expect(code).toEqual(0);
    });
  });
});
