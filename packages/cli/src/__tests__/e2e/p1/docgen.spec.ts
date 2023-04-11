import { clearStyle, polywrapCli } from "../utils";
import { DocgenCommandOptions } from "../../../commands";

import { Commands, runCli } from "@polywrap/cli-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import os from "os";
import rimraf from "rimraf";
import { compareSync } from "dir-compare";

const HELP = `Usage: polywrap docgen|o <action> [options]

Generate wrapper documentation

Arguments:
  action                             
    schema      Generate GraphQL schema
    docusaurus    Generate Docusaurus markdown
    jsdoc         Generate JSDoc markdown
   (choices: "schema", "docusaurus", "jsdoc")

Options:
  -m, --manifest-file <path>         Path to the project manifest file
                                     (default: polywrap.yaml | polywrap.yml)
  -g, --docgen-dir <path>            Output directory for generated docs
                                     (default: ./docs)
  -c, --client-config <config-path>  Add custom configuration to the
                                     PolywrapClient
  --wrapper-envs <envs-path>         Path to a JSON file containing wrapper
                                     envs
  -i, --imports                      Also generate docs for dependencies
  -v, --verbose                      Verbose output (default: false)
  -q, --quiet                        Suppress output (default: false)
  -l, --log-file [path]              Log file to save console output to
  -h, --help                         display help for command
`;

describe("e2e tests for docgen command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "docgen");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  const testCliOutput = (
    testCaseDir: string,
    exitCode: number,
    stdout: string,
    stder: string
  ) => {
    const output = clearStyle(stdout);
    const error = clearStyle(stder);

    const expected = JSON.parse(
      fs.readFileSync(
        path.join(testCaseDir, "expected", "stdout.json"),
        "utf-8"
      )
    );

    if (expected.stdout) {
      if (Array.isArray(expected.stdout)) {
        for (const line of expected.stdout) {
          expect(output).toContain(line);
        }
      } else {
        expect(output).toContain(expected.stdout);
      }
    }

    if (expected.stderr) {
      if (Array.isArray(expected.stderr)) {
        for (const line of expected.stderr) {
          expect(error).toContain(line);
        }
      } else {
        expect(error).toContain(expected.stderr);
      }
    }

    if (expected.exitCode) {
      expect(exitCode).toEqual(expected.exitCode);
    }

    if (expected.files) {
      for (const file of expected.files) {
        expect(fs.existsSync(path.join(testCaseDir, file))).toBeTruthy();
      }
    }
  };

  const testDocgenOutput = (testCaseDir: string, docgenDir: string) => {
    if (fs.existsSync(path.join(testCaseDir, "expected", "docs"))) {
      const expectedTypesResult = compareSync(
        docgenDir,
        path.join(testCaseDir, "expected", "docs"),
        { compareContent: true }
      );
      expect(expectedTypesResult.differences).toBe(0);
    }
  };

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: ["docgen", "--help"],
      config: {
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      }
    });

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should throw error for unknown option --invalid", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await Commands.docgen("docusaurus",{
      args: ["--invalid"],
    }, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });


    expect(code).toEqual(1);
    expect(error).toBe("error: unknown option '--invalid'\n");
    expect(output).toEqual(``);
  });

  describe("missing option arguments", () => {
    const missingOptionArgs = {
      "--manifest-file": "-m, --manifest-file <path>",
      "--docgen-dir": "-g, --docgen-dir <path>",
      "--client-config": "-c, --client-config <config-path>",
    };

    for (const [option, errorMessage] of Object.entries(missingOptionArgs)) {
      it(`Should throw error if params not specified for ${option} option`, async () => {
        const { exitCode: code, stdout: output, stderr: error } = await Commands.docgen("docusaurus", {
          args: [option],
        }, {
          cwd: getTestCaseDir(0),
          cli: polywrapCli,
        });

        expect(code).toEqual(1);
        expect(error).toBe(
          `error: option '${errorMessage}' argument missing\n`
        );
        expect(output).toEqual(``);
      });
    }
  });

  it("Should store build files in specified docgen dir", async () => {
    const docgenDir = fs.mkdtempSync(
      path.join(os.tmpdir(), `polywrap-cli-tests`)
    );
    const testCaseDir = getTestCaseDir(0);
    const { exitCode: code, stdout: output, stderr: error } = await Commands.docgen("docusaurus", {
      args: ["docgen", "docusaurus", "--docgen-dir", docgenDir],
    }, {
      cwd: testCaseDir,
      cli: polywrapCli,
    });

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toContain(
      `🔥 Docs were generated successfully 🔥`
    );
  });

  it("Should successfully generate docs", async () => {
    rimraf.sync(`${getTestCaseDir(0)}/docs`);

    const { exitCode: code, stdout: output, stderr: error } = await Commands.docgen("docusaurus", {}, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(
      `🔥 Docs were generated successfully 🔥`
    );

    rimraf.sync(`${getTestCaseDir(0)}/docs`);
  });

  describe("test-cases", () => {
    for (let i = 0; i < testCases.length; ++i) {
      const testCaseName = testCases[i];
      const testCaseDir = getTestCaseDir(i);

      let docgenDir = path.join(testCaseDir, "docs");
      let args: Partial<DocgenCommandOptions> & { doc: string } = { doc: "docusaurus" };
      let cmdFile = path.join(testCaseDir, "cmd.json");
      if (fs.existsSync(cmdFile)) {
        const cmdConfig = JSON.parse(fs.readFileSync(cmdFile, "utf-8"));
        if (cmdConfig) {
          args = cmdConfig;
        }

        if(cmdConfig.docgenDir) {
          docgenDir = path.join(testCaseDir, cmdConfig.docgenDir);
        }
      }

      const docType = args.doc as "docusaurus" | "jsdoc" | "schema";
      // @ts-ignore
      delete args.doc;
      test(testCaseName, async () => {
        let { exitCode, stdout, stderr } = await Commands.docgen(docType, args, {
          cwd: testCaseDir,
          cli: polywrapCli,
        });

        testCliOutput(testCaseDir, exitCode, stdout, stderr);
        testDocgenOutput(testCaseDir, docgenDir);
      });
    }
  });
});
