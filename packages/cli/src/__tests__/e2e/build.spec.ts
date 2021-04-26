import path from "path";
import { clearStyle } from "./utils";

import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 build [options] [<web3api-manifest>]

Options:
  -h, --help                         Show usage information
  -i, --ipfs [<node>]                Upload build results to an IPFS node (default: dev-server's node)
  -o, --output-dir <path>            Output directory for build results (default: build/)
  -e, --test-ens <[address,]domain>  Publish the package to a test ENS domain locally (requires --ipfs)
  -w, --watch                        Automatically rebuild when changes are made (default: false)

`;

describe("e2e tests for build command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--help"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--output-dir"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--output-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - testEns", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--test-ens"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option missing <[address,]domain> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ipfs", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "--test-ens", "test.eth"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--test-ens option requires the --ipfs [<node>] option
${HELP}`);
  });

  test("Should throw error for invalid web3api - invalid route", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "invalid-web3api-1.yaml"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`- Compile Web3API
- Build schema
- Load web3api from invalid-web3api-1.yaml
✔ Load web3api from invalid-web3api-1.yaml
✖ Failed to build schema: ENOENT: no such file or directory, open '${projectRoot}/src/wrong/schema.graphql'
✖ Failed to compile Web3API: ENOENT: no such file or directory, open '${projectRoot}/src/wrong/schema.graphql'
`);
  });

  test("Should throw error for invalid web3api - invalid field", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build", "invalid-web3api-2.yaml"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toContain(`- Compile Web3API
- Build schema
- Load web3api from invalid-web3api-2.yaml
✖ Failed to load web3api from invalid-web3api-2.yaml: Field wrong_mutation is not accepted in the schema. Please check the accepted fields here:`);
  });

  test("Successfully build the project", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["build"],
        cwd: projectRoot,
      },
      "../../../bin/w3"
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`- Compile Web3API
- Build schema
- Load web3api from web3api.yaml
✔ Load web3api from web3api.yaml
- Output web3api to build/web3api.yaml
✔ Output web3api to build/web3api.yaml
✔ Build schema
- Compile Wasm modules
  Compiling WASM module: ./src/query/index.ts => ${projectRoot}/build/query.wasm
- Compile Wasm modules
  Compiling WASM module: ./src/mutation/index.ts => ${projectRoot}/build/mutation.wasm
- Compile Wasm modules
✔ Compile Wasm modules
✔ Compile Web3API
`);
  });
});
