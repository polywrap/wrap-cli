import { polywrapCli } from "../utils";
import { defaultDocsManifest, intlMsg } from "../../../";

import { Commands, runCli } from "@polywrap/cli-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fse from "fs-extra";
import path from "path";

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
  -m, --manifest-file <path>  Path to the Polywrap manifest file (default:
                              polywrap.yaml | polywrap.yml)
  -v, --verbose               Verbose output (default: false)
  -q, --quiet                 Suppress output (default: false)
  -l, --log-file [path]       Log file to save console output to
  -h, --help                  display help for command
`;

describe("docs command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "build-cmd/wasm/assemblyscript/001-sanity");
  const manifestFileName = defaultDocsManifest[0];
  const manifestFile = path.join(testCaseRoot, manifestFileName);

  it("should show help text", async () => {
    const { exitCode, stdout, stderr } = await runCli({
      args: ["docs"],
      config: {
        cli: polywrapCli
      }
    });

    expect(stderr).toBe(DOCS_HELP);
    expect(stdout).toBe("");
    expect(exitCode).toEqual(1);
  });

  describe("init command", () => {
    it("should show help text", async () => {
      const { exitCode, stdout, stderr } = await Commands.docs.init({
        help: true
      }, {
        cli: polywrapCli,
        cwd: testCaseRoot
      });

      expect(stdout).toBe(DOCS_INIT_HELP);
      expect(stderr).toBe("");
      expect(exitCode).toEqual(0);
    });

    it("should set up wrap docs - no file collisions", async () => {
      const { exitCode, stdout, stderr } = await Commands.docs.init({}, {
        cli: polywrapCli,
        cwd: testCaseRoot
      });

      expect(stdout).toContain(intlMsg.commands_docs_init_msg_manifest_created({
        manifestFile: manifestFileName
      }));
      expect(stderr).toContain("Set the 'extensions.docs' property");
      expect(exitCode).toEqual(0);
      expect(fse.existsSync(manifestFile)).toBe(true);

      fse.rmSync(manifestFile);
    });

    it("should error when setting up wrap docs - manifest file collision", async () => {
      await fse.createFile(manifestFile);

      const { exitCode, stdout, stderr } = await Commands.docs.init({}, {
        cli: polywrapCli,
        cwd: testCaseRoot
      });

      expect(stderr).toContain(
        intlMsg.commands_docs_init_error_manifest_exists({
          manifestFile: manifestFileName,
        })
      );
      expect(stdout).toBe("");
      expect(exitCode).toEqual(1);

      fse.rmSync(manifestFile);
    });
  });
});
