import { clearStyle, polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import rimraf from "rimraf";
import { ProjectType, supportedLangs } from "../../commands";

const HELP = `Usage: polywrap create|c [options] [command]

Create a new project with polywrap CLI

Options:
  -h, --help                          display help for command

Commands:
  wasm [options] <language> <name>    Create a Polywrap wasm wrapper langs:
                                      assemblyscript, rust, interface
  app [options] <language> <name>     Create a Polywrap application langs:
                                      typescript-node, typescript-react
  plugin [options] <language> <name>  Create a Polywrap plugin langs:
                                      typescript
  help [command]                      display help for command
`;

describe("e2e tests for create command", () => {
  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "--help"],
      cli: polywrapCli,
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should show help for no parameters", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  it("Should throw error for invalid project type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI({
      args: ["create", "unknown", "app", "name"],
      cli: polywrapCli,
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'unknown'");
    expect(output).toBe("");
  });

  for (const project of Object.keys(supportedLangs)) {
    describe(project, () => {
      it("Should throw error for missing required argument - language", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["create", project],
          cli: polywrapCli,
        });
    
        expect(code).toEqual(1);
        expect(error).toContain("error: missing required argument 'language");
        expect(output).toBe("");
      });
    
      it("Should throw error for missing required argument - name", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["create", project, "lang"],
          cli: polywrapCli,
        });
    
        expect(code).toEqual(1);
        expect(error).toContain("error: missing required argument 'name'");
        expect(output).toBe("");
      });
    
      it("Should throw error for invalid lang parameter", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCLI({
          args: ["create", project, "lang", "demo"],
          cli: polywrapCli,
        });
    
        expect(code).toEqual(1);
        expect(error).toContain(
          `error: command-argument value 'lang' is invalid for argument 'language'. Allowed choices are ${supportedLangs[project as ProjectType].join(", ")}.`
        );
        expect(output).toBe("");
      });
  
      for (const lang of supportedLangs[project as ProjectType]) {
        describe(lang, () => {
          it("Should throw error for missing path argument for --output-dir option", async () => {
            const { exitCode: code, stdout: output, stderr: error } = await runCLI({
              args: ["create", project, lang, "name", "-o"],
              cli: polywrapCli,
            });
        
            expect(code).toEqual(1);
            expect(error).toContain(
              "error: option '-o, --output-dir <path>' argument missing"
            );
            expect(output).toBe("");
          });
    
          it("Should successfully generate project", async () => {
            rimraf.sync(`${__dirname}/test`);
        
            const { exitCode: code, stdout: output } = await runCLI({
              args: [
                "create",
                project,
                lang,
                "test",
                "-o",
                `${__dirname}/test`,
              ],
              cwd: __dirname,
              cli: polywrapCli,
            });
        
            expect(code).toEqual(0);
            expect(clearStyle(output)).toMatch(
              /🔥 You are ready to ([A-Za-z ]+) Polywrap 🔥/
            );
        
            rimraf.sync(`${__dirname}/test`);
          }, 60000);
        })
      }
    });
  }
});
