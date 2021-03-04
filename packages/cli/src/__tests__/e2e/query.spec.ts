import path from "path";
import { clearStyle, run } from "./utils";

const HELP = `
w3 query [options] <recipe-script>

Options:
  -t, --test-ens  Use the development server's ENS instance

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
    expect(clearStyle(output))
      .toEqual(`Required argument <recipe-script> is missing
${HELP}`);
  });

  test("Should successfully return response", async () => {
    const errorHandler = jest.fn();

    const { code: testenvCode } = await run(
      "../../../bin/w3",
      ["test-env", "up"],
      projectRoot,
      errorHandler
    );
    expect(errorHandler).not.toBeCalled();
    expect(testenvCode).toEqual(0);

    await run(
      "node",
      ["./deploy-contracts.js"],
      projectRoot,
      errorHandler
    );

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
    expect(clearStyle(output)).toContain(`-----------------------------------
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
-----------------------------------
-----------------------------------
{
  "setData": {
    "txReceipt": "0x`);
      expect(clearStyle(output)).toContain(`",
    "value": 569
  }
}
-----------------------------------
`);

    await run(
      "../../../bin/w3",
      ["test-env", "down"],
      projectRoot,
      errorHandler
    );
  }, 240000);
});
