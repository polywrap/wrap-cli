import path from "path";
import { clearStyle, w3Cli } from "./utils";
import { runCLI } from "@web3api/test-env-js";

const HELP = `
w3 app command [options]

Commands:
  codegen   Generate code for the app

Options:
  -h, --help                              Show usage information
  -m, --manifest-file <path>              Path to the Web3API App manifest file (default: web3api.app.yaml | web3api.app.yml)
  -c, --codegen-dir <path>                 Output directory for the generated code (default: ./src/w3)
  -i, --ipfs [<node>]                     IPFS node to load external schemas (default: ipfs.io & localhost)
  -e, --ens [<address>]                   ENS address to lookup external schemas (default: 0x0000...2e1e)

`;

describe("e2e tests for app command", () => {
  const projectRoot = path.resolve(__dirname, "../app/");
  const simpleStorageProject = path.resolve(__dirname, "../project/");

  beforeAll(async () => {
    await testEnvUp(simpleStorageProject);
    await buildApi(simpleStorageProject);
  });

  afterAll(async () => {
    await testEnvDown(simpleStorageProject);
  });

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "--help"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Should throw error for invalid params - no command", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "--output-dir"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`Please provide a command
${HELP}`);
  });

  test("Should throw error for invalid params - codegen-dir", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "--codegen-dir"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--codegen-dir option missing <path> argument
${HELP}`);
  });

  test("Should throw error for invalid params - ens", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "--ens"],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(code).toEqual(1);
    expect(error).toBe("");
    expect(clearStyle(output))
      .toEqual(`--ens option missing [<address>] argument
${HELP}`);
  });

  test("Should successfully generate types for plugins", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "-m", `${projectRoot}/web3api.app.withPlugin.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(`- Manifest loaded from ./web3api.app.withPlugin.yaml
✔ Manifest loaded from ./web3api.app.withPlugin.yaml
- Generate types
✔ Generate types
🔥 Code was generated successfully 🔥
`);
  });

  test("Should successfully generate types for multiple packages", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["app", "codegen", "-m", `${projectRoot}/web3api.app.multiPackage.yaml`],
        cwd: projectRoot,
        cli: w3Cli,
      },
    );

    expect(error).toBe("");
    expect(code).toEqual(0);
    expect(clearStyle(output)).toEqual(`- Manifest loaded from ./web3api.app.multiPackage.yaml
✔ Manifest loaded from ./web3api.app.multiPackage.yaml
- Generate types
✔ Generate types
🔥 Code was generated successfully 🔥
`);
  });
});

async function testEnvUp(cwd: string): Promise<void> {
  const { exitCode: testenvCode, stderr: testEnvUpErr } = await runCLI({
    args: ["test-env", "up"],
    cwd: cwd,
    cli: w3Cli,
  });
  expect(testEnvUpErr).toBe("");
  expect(testenvCode).toEqual(0);
}

async function testEnvDown(cwd: string): Promise<void> {
  await runCLI({
    args: ["test-env", "down"],
    cwd: cwd,
    cli: w3Cli,
  });
}

async function buildApi(cwd: string): Promise<void> {
  const { exitCode: buildCode, stderr: buildErr } = await runCLI({
    args: [
      "build",
    ],
    cwd: cwd,
    cli: w3Cli,
  });
  expect(buildErr).toBe("");
  expect(buildCode).toEqual(0);
}
