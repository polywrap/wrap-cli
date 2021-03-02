import path from "path";
import { run, clearStyle } from "./utils";

describe("e2e tests for no command", () => {
  test("Should throw error for unrecognized command", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "unknown"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`w3 unknown is not a command\n`);
  });

  test("Should let the user to type w3 help", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(
      `Type w3 help to view common commands\n`
    );
  });
});
