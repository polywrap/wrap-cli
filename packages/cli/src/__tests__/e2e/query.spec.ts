import chalk from "chalk";
import path from "path";
import { run } from "./utils";

const HELP = `${chalk["reset"](`
w3 query [options] <recipe-script>`)}

${chalk["reset"](`Options:
  -t, --test-ens  Use the development server's ENS instance
`)}
`;

describe("e2e tests for query command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should throw error for missing recipe-string", async () => {
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "../../../bin/w3",
      ["query"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(`${chalk["red"](
      "Required argument <recipe-script> is missing"
    )}
${HELP}`);
  });

  test("Should successfully return response if docker is running", async () => {
    const errorHandler = jest.fn();

    const { code: testenvCode } = await run(
      "../../../bin/w3",
      ["test-env", "up"],
      projectRoot,
      errorHandler
    );
    expect(errorHandler).not.toBeCalled();

    if (!testenvCode) {
      const { code: deployCode } = await run(
        "node",
        ["./deploy-contracts.js"],
        projectRoot,
        errorHandler
      );

      expect(deployCode).toEqual(0);
      expect(errorHandler).not.toBeCalled();

      const { code: buildCode } = await run(
        "../../../bin/w3",
        [
          "build",
          "--ipfs",
          "http://localhost:5001",
          "--test-ens",
          "simplestorage.eth",
        ],
        projectRoot,
        errorHandler
      );

      expect(buildCode).toEqual(0);
      expect(errorHandler).not.toBeCalled();

      const { code, output } = await run(
        "../../../bin/w3",
        ["query", "./recipes/e2e.json", "--test-ens"],
        projectRoot,
        errorHandler
      );

      expect(code).toEqual(0);
      expect(errorHandler).not.toBeCalled();

      const constants = require(`${projectRoot}/recipes/constants.json`);
      expect(output).toEqual(`${chalk["yellow"](
        "-----------------------------------"
      )}
mutation {
  setData(
    options: {
      address: $address
      value: $value
    }
  ) {
    value
    txReceipt
  }
}

{
  "address": "${constants.SimpleStorageAddr}",
  "value": 569
}
${chalk["yellow"]("-----------------------------------")}
${chalk["green"]("-----------------------------------")}
{
  "setData": {
    "txReceipt": "0xc6a64d3e6dfaafd02b8ce8f12786aeb7682adddd0c7a205bb8661eec7b9ceb4a",
    "value": 569
  }
}
${chalk["green"]("-----------------------------------")}
`);
    }
  }, 40000);
});
