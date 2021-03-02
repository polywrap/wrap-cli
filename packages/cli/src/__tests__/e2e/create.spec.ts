import path from "path";
import { supportedLangs } from "../../commands/create";
import { clearStyle, run } from "./utils";

const HELP = `
w3 create command <project-name> [options]

Commands:
  api <lang>     Create a Web3API project
    langs: ${supportedLangs.api.join(", ")}
  app <lang>     Create a Web3API application
    langs: ${supportedLangs.app.join(", ")}
  plugin <lang>  Create a Web3API plugin
    langs: ${supportedLangs.plugin.join(", ")}

Options:
  -h, --help               Show usage information
  -o, --output-dir <path>  Output directory for the new project

`;

describe("e2e tests for create command", () => {
  test("Should show help text", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "--help"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for missing parameter - type", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Please provide a command
${HELP}`);
  });

  test("Should throw error for missing parameter - lang", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "type"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Please provide a language
${HELP}`);
  });

  test("Should throw error for missing parameter - name", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "type", "lang"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Please provide a project name
${HELP}`);
  });

  test("Should throw error for invalid parameter - type", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "unknown", "app", "name"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Unrecognized command "unknown"
${HELP}`);
  });

  test("Should throw error for invalid parameter - lang", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "api", "unknown", "name"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Unrecognized language "unknown"
${HELP}`);
  });

  test("Should throw error for invalid parameter - output-dir", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "create", "api", "assemblyscript", "name", "-o"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test.only("Should successfully generate project", async () => {
    const projectRoot = path.resolve(__dirname, "../project");
    const errorHandler = jest.fn();

    const rimraf = require("rimraf");
    rimraf.sync(`${projectRoot}/test`);

    const { code, output } = await run(
      "../../../bin/w3",
      ["create", "api", "assemblyscript", "test", "-o", "./test"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(clearStyle(output)).toContain(
      `🔥 You are ready to turn your protocol into a Web3API 🔥`
    );

    rimraf.sync(`${projectRoot}/test`);
  }, 10000);
});
