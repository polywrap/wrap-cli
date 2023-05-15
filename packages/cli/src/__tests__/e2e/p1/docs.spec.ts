import { runCli } from "@polywrap/cli-js";
import { polywrapCli } from "../utils";

import fse from "fs-extra";
import fs from "fs";
import path from "path";
import { defaultDocsManifest, intlMsg } from "polywrap";
import { defaultDocsDir } from "../../../lib";

const DOCS_HELP = `Usage: polywrap docs [options] [command]

Documentation commands

Options:
  -h, --help        display help for command

Commands:
  init|i [options]  Initialize wrap docs
  help [command]    display help for command
`;

const DOCS_INIT_HELP = `Usage: polywrap docs init|i [options]

Initialize wrap docs

Options:
  -m, --manifest-file <path>  Path to docs manifest file to be created.
                              Default: polywrap.docs.yaml | polywrap.docs.yml
  -d, --dir <path>            Path to docs dir to be created. Default: ./docs
  -f, --force                 Force overwrite docs manifest and/or docs
                              directory.
  -v, --verbose               Verbose output (default: false)
  -q, --quiet                 Suppress output (default: false)
  -l, --log-file [path]       Log file to save console output to
  -h, --help                  display help for command
`;

describe("docs command", () => {
  it("should show help text", async () => {
    const { exitCode, stdout, stderr } = await runCli({
      args: ["docs"],
      config: {
        cli: polywrapCli,
      },
    });

    expect(stderr).toBe(DOCS_HELP);
    expect(stdout).toBe("");
    expect(exitCode).toEqual(1);
  });

  describe("init command", () => {
    const tempDir = path.join(__dirname, "temp_docs");

    const clearTempDirIfExists = async () => {
      if (fse.existsSync(tempDir)) {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      }
    };

    beforeEach(async () => {
      await clearTempDirIfExists();

      await fse.mkdir(tempDir);
    });

    afterEach(async () => {
      await clearTempDirIfExists();
    });

    it("should show help text", async () => {
      const { exitCode, stdout, stderr } = await runCli({
        args: ["docs", "init", "--help"],
        config: {
          cli: polywrapCli,
        },
      });

      expect(stdout).toBe(DOCS_INIT_HELP);
      expect(stderr).toBe("");
      expect(exitCode).toEqual(0);
    });

    it("should set up wrap docs - no file collisions", async () => {
      const { exitCode, stdout, stderr } = await runCli({
        args: ["docs", "init"],
        config: {
          cli: polywrapCli,
          cwd: tempDir,
        },
      });

      expect(stdout).toContain(intlMsg.commands_docs_init_success_end());
      expect(stderr).toBe("");
      expect(exitCode).toEqual(0);
    });

    it("should error when setting up wrap docs - manifest file collision", async () => {
      const manifestFileName = defaultDocsManifest[0];
      const manifestFile = path.join(tempDir, manifestFileName);

      await fse.createFile(manifestFile);

      const { exitCode, stdout, stderr } = await runCli({
        args: ["docs", "init"],
        config: {
          cli: polywrapCli,
          cwd: tempDir,
        },
      });

      expect(stderr).toContain(
        intlMsg.commands_docs_init_error_manifest_exists({
          manifestFile: manifestFileName,
        })
      );
      expect(stdout).toBe("");
      expect(exitCode).toEqual(1);
    });

    it("should error when setting up wrap docs - dir collision", async () => {
      const docsDirPath = path.join(tempDir, defaultDocsDir);

      await fse.mkdir(docsDirPath);

      const { exitCode, stdout, stderr } = await runCli({
        args: ["docs", "init"],
        config: {
          cli: polywrapCli,
          cwd: tempDir,
        },
      });

      expect(stderr).toContain(
        intlMsg.commands_docs_init_error_dir_exists({
          dir: docsDirPath,
        })
      );
      expect(stdout).toBe("");
      expect(exitCode).toEqual(1);
    });

    it("should apply custom manifest file and docs dir names when setting up wrap docs", async () => {
      const defaultManifestFile = path.join(tempDir, defaultDocsManifest[0]);
      const defaultDocsDirPath = path.join(tempDir, defaultDocsDir);

      const customManifestFileName = "test.yaml";
      const customDocsDirName = "test";

      const customManifestFilePath = path.join(tempDir, customManifestFileName);
      const customDocsDirPath = path.join(tempDir, customDocsDirName);

      const { exitCode, stdout, stderr } = await runCli({
        args: [
          "docs",
          "init",
          "-m",
          customManifestFileName,
          "-d",
          customDocsDirName,
        ],
        config: {
          cli: polywrapCli,
          cwd: tempDir,
        },
      });

      expect(stderr).toBe("");

      expect(fse.existsSync(defaultManifestFile)).toBeFalsy();
      expect(fse.existsSync(defaultDocsDirPath)).toBeFalsy();

      expect(fse.existsSync(customManifestFilePath)).toBeTruthy();
      expect(fse.existsSync(customDocsDirPath)).toBeTruthy();

      expect(stdout).toContain(intlMsg.commands_docs_init_success_end());
      expect(exitCode).toEqual(0);
    });
  });
});
