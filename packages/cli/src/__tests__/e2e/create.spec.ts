import { clearStyle, polywrapCli } from "./utils";
import { ProjectType, supportedLangs } from "../../commands";
import { UrlFormat } from "../../lib";

import { runCli } from "@polywrap/cli-js";
import rimraf from "rimraf";
import path from "path";
import fs from "fs";

const HELP = `Usage: polywrap create|c [options] [command]

Create New Projects

Options:
  -h, --help                          display help for command

Commands:
  wasm [options] <language> <name>    Create a Polywrap wasm wrapper. langs:
                                      assemblyscript, rust, interface
  app [options] <language> <name>     Create a Polywrap application. langs:
                                      typescript
  plugin [options] <language> <name>  Create a Polywrap plugin. langs:
                                      typescript
  template [options] <url> <name>     Download template from a URL. formats:
                                      .git
  help [command]                      display help for command
`;

const VERSION =
  fs.readFileSync(
    path.join(__dirname, "../../../../../VERSION"),
    "utf-8"
  )
  .replace(/\n/g, "")
  .replace(/\r/g, "");

const urlExamples = (format: UrlFormat): string => {
  if (format === UrlFormat.git) {
    return "https://github.com/polywrap/logging.git";
  }
  throw Error("This should never happen");
}

describe("e2e tests for create command", () => {
  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: ["create", "--help"],
      config: {
        cli: polywrapCli
      },
    });

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should show help for no parameters", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: ["create"],
      config: {
        cli: polywrapCli
      },
    });

    expect(code).toEqual(1);
    expect(error).toBe(HELP);
    expect(output).toBe("");
  });

  it("Should throw error for invalid project type", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCli({
      args: ["create", "unknown", "app", "name"],
      config: {
        cli: polywrapCli,
      }
    });

    expect(code).toEqual(1);
    expect(error).toContain("error: unknown command 'unknown'");
    expect(output).toBe("");
  });

  for (const project of Object.keys(supportedLangs)) {
    describe(project, () => {
      it("Should throw error for missing required argument - language", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCli({
          args: ["create", project],
          config: {
            cli: polywrapCli,
          }
        });
    
        expect(code).toEqual(1);
        expect(error).toContain("error: missing required argument 'language'");
        expect(output).toBe("");
      });
    
      it("Should throw error for missing required argument - name", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCli({
          args: ["create", project, "lang"],
          config: {
            cli: polywrapCli,
          }
        });
    
        expect(code).toEqual(1);
        expect(error).toContain("error: missing required argument 'name'");
        expect(output).toBe("");
      });
    
      it("Should throw error for invalid lang parameter", async () => {
        const { exitCode: code, stdout: output, stderr: error } = await runCli({
          args: ["create", project, "lang", "demo"],
          config: {
            cli: polywrapCli,
          }
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
            const { exitCode: code, stdout: output, stderr: error } = await runCli({
              args: ["create", project, lang, "name", "-o"],
              config: {
                cli: polywrapCli,
              }
            });
        
            expect(code).toEqual(1);
            expect(error).toContain(
              "error: option '-o, --output-dir <path>' argument missing"
            );
            expect(output).toBe("");
          });
    
          it("Should successfully generate project", async () => {
            rimraf.sync(`${__dirname}/test`);
        
            const { exitCode: code, stdout: output } = await runCli({
              args: [
                "create",
                project,
                lang,
                "test",
                "-o",
                `${__dirname}/test`,
              ],
              config: {
                cwd: __dirname,
                cli: polywrapCli,
                env: {
                  ...process.env,
                  OVERRIDE_CREATE_TEMPLATES_NPM: `@polywrap/templates@${VERSION}`
                }
              }
            });

            expect(code).toEqual(0);
            expect(clearStyle(output)).toContain(
              "🔥 You are ready "
            );

            rimraf.sync(`${__dirname}/test`);
          }, 60000);
        })
      }
    });
  }

  describe.skip("template", () => {
    it("Should throw error for missing required argument - url", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCli({
        args: ["create", "template"],
        config: {
          cli: polywrapCli,
        }
      });

      expect(code).toEqual(1);
      expect(error).toContain("error: missing required argument 'url'");
      expect(output).toBe("");
    });

    it("Should throw error for missing required argument - name", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCli({
        args: ["create", "template", "lang"],
        config: {
          cli: polywrapCli,
        }
      });

      expect(code).toEqual(1);
      expect(error).toContain("error: missing required argument 'name'");
      expect(output).toBe("");
    });

    it("Should throw error for invalid url parameter", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runCli({
        args: ["create", "template", "lang", "demo"],
        config: {
          cli: polywrapCli,
        }
      });

      expect(code).toEqual(1);
      expect(error).toContain(`URL 'lang' uses an invalid format. Valid URL formats: ${Object.values(UrlFormat).join(", ")}`);
      expect(output).toBe("");
    });

    for (const format of Object.values(UrlFormat)) {
      const url = urlExamples(format);

      describe(format, () => {
        it("Should throw error for missing path argument for --output-dir option", async () => {
          const { exitCode: code, stdout: output, stderr: error } = await runCli({
            args: ["create", "template", url, "name", "-o"],
            config: {
              cli: polywrapCli,
            }
          });

          expect(code).toEqual(1);
          expect(error).toContain(
            "error: option '-o, --output-dir <path>' argument missing"
          );
          expect(output).toBe("");
        });

        it("Should successfully generate project", async () => {
          rimraf.sync(`${__dirname}/test`);

          const { exitCode: code, stdout: output } = await runCli({
            args: [
              "create",
              "template",
              url,
              "test",
              "-o",
              `${__dirname}/test`,
            ],
            config: {
              cwd: __dirname,
              cli: polywrapCli,
            }
          });

          expect(code).toEqual(0);
          expect(clearStyle(output)).toContain(
            "🔥 You are ready "
          );

          rimraf.sync(`${__dirname}/test`);
        }, 60000);
      })
    }
  });
});
