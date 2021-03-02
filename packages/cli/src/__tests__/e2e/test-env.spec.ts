import chalk from "chalk";
import path from "path";
import run from "./run";

const HELP = `${chalk["reset"](`
w3 test-env command`)}

${chalk["reset"](`Commands:
  up    Startup the test env
  down  Shutdown the test env
`)}
`;

describe("e2e tests for test-env command", () => {
  test("Should throw error for no command given", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "test-env"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(`${chalk["red"]("No command given")}
${HELP}`);
  });

  test("Should throw error for unrecognized command", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "test-env", "unknown"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(`${chalk["red"]("Unrecognized command: unknown")}
${HELP}`);
  });

  test("Should successfully start test environment", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "test-env", "up"],
      projectRoot,
      errorHandler
    );

    // In case the docker is not running, the code should be 1, otherwise it should be 0
    expect(code == 0 || code == 1).toBeTruthy();
    if (!code) {
      expect(errorHandler).not.toBeCalled();
      expect(output).toEqual(`- Starting test environment...
✔ Starting test environment...
`);
    }
  });

  test("Should successfully shut down test environment", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "test-env", "down"],
      projectRoot,
      errorHandler
    );

    // In case the docker is not running, the code should be 1, otherwise it should be 0
    expect(code == 0 || code == 1).toBeTruthy();
    if (!code) {
      expect(errorHandler).not.toBeCalled();
      expect(output).toEqual(`- Shutting down test environment...
✔ Shutting down test environment...
`);
    }
  });
});
