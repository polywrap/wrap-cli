import path from "path";
import { clearStyle, run } from "./utils";

const HELP = `
w3 build [options] [<web3api-manifest>]

Options:
  -h, --help                         Show usage information
  -i, --ipfs [<node>]                Upload build results to an IPFS node (default: dev-server's node)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally (requires --ipfs)

`;

describe("e2e tests for build command", () => {
  test("Should show help text", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "--help"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "--output-dir"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - testEns", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "--test-ens"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output))
      .toEqual(`--test-ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ipfs", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "--test-ens", "test.eth"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output))
      .toEqual(`--test-ens option requires the --ipfs [<node>] option
${HELP}`);
  });

  test("Should throw error for invalid web3api - invalid route", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "invalid-web3api-1.yaml"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(1);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toContain(`- Compile Web3API
- Load web3api from invalid-web3api-1.yaml
✔ Load web3api from invalid-web3api-1.yaml
✖ Failed to compile Web3API: ENOENT: no such file or directory, open '${projectRoot}/src/wrong/schema.graphql'
`);
  });

  test("Should throw error for invalid web3api - invalid field", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build", "invalid-web3api-2.yaml"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(1);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toContain(`- Compile Web3API
- Load web3api from invalid-web3api-2.yaml
✖ Failed to load web3api from invalid-web3api-2.yaml: Field wrong_mutation is not accepted in the schema. Please check the accepted fields here:`);
  });

  test("Successfully build the project", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "build"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(clearStyle(output)).toEqual(`- Compile Web3API
- Load web3api from web3api.yaml
✔ Load web3api from web3api.yaml
  Compiling WASM module: ./src/mutation/index.ts => ${projectRoot}/build/mutation.wasm
- Compile Web3API
  Compiling WASM module: ./src/query/index.ts => ${projectRoot}/build/query.wasm
- Compile Web3API
- Output web3api to build/web3api.yaml
✔ Output web3api to build/web3api.yaml
✔ Compile Web3API
`);
  });
});
