import chalk from "chalk";
import path from "path";
import { defaultGenerationFile, defaultManifest } from "../../commands/codegen";
import run from "./run";

const HELP = `${chalk["reset"](`
w3 codegen [<generation-file>] [options]`)}

${chalk["reset"](`Generation file:
  Path to the generation file (default: ${defaultGenerationFile})`)}

${chalk["reset"](`Options:
  -h, --help                              Show usage information
  -m, --manifest-path <path>              Path to the Web3API manifest file (default: ${defaultManifest.join(
    " | "
  )})
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: dev-server's node)
  -o, --output-dir <path>                 Output directory for generated types (default: types/)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)
`)}
`;

describe("e2e tests for codegen command", () => {
  test("Should show help text", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "codegen", "--help"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(HELP);
  });

  test("Should throw error for invalid params - outputDir", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "codegen", "--output-dir"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(`${chalk["red"](
      "--output-dir option missing <path> argument"
    )}
${HELP}`);
  });

  test("Should throw error for invalid params - ens", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "codegen", "--ens"],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(0);
    expect(errorHandler).not.toBeCalled();
    expect(output).toEqual(`${chalk["red"](
      "--ens option missing <[address,]domain> argument"
    )}
${HELP}`);
  });

  test("Should throw error for invalid generation file - wrong file", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "codegen", `web3api-invalid.gen.js`],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(1);
    expect(errorHandler).not.toBeCalled();
    expect(output).toContain(`- Generate types
- Load web3api from web3api.yaml
✔ Load web3api from web3api.yaml
✖ Failed to generate types: Cannot find module '${projectRoot}/web3api-invalid.gen.js'`);
  });

  test("Should throw error for invalid generation file - no run() method", async () => {
    const projectRoot = path.resolve(__dirname, "../project/");
    const errorHandler = jest.fn();

    const { code, output } = await run(
      "npx",
      ["w3", "codegen", `web3api-norun.gen.js`],
      projectRoot,
      errorHandler
    );

    expect(code).toEqual(1);
    expect(errorHandler).not.toBeCalled();
    expect(output).toContain(`- Generate types
- Load web3api from web3api.yaml
✔ Load web3api from web3api.yaml
✖ Failed to generate types: The generation file provided doesn't have the 'run' method.`);
  });
});
