import path from "path";
import { clearStyle, run } from "./utils";

const HELP = `
w3 test-env command

Commands:
  up    Startup the test env
  down  Shutdown the test env

`;

describe("e2e tests for test-env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should throw error for no command given", async () => {
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "../../../bin/w3",
      ["test-env"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test("Should throw error for unrecognized command", async () => {
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "../../../bin/w3",
      ["test-env", "unknown"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`Unrecognized command: unknown
${HELP}`);
  });

  test("Should successfully start test environment", async () => {
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "../../../bin/w3",
      ["test-env", "up"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`- Starting test environment...
✔ Starting test environment...
`);
  }, 15000);

  test("Should successfully shut down test environment", async () => {
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "../../../bin/w3",
      ["test-env", "down"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`- Shutting down test environment...
✔ Shutting down test environment...
`);
  }, 15000);
});
