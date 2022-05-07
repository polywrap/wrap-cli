import fs from 'fs';
import path from "path";
import net from "net";
import { clearStyle, w3Cli } from "./utils";

import { GetPathToCliTestFiles } from "@web3api/test-cases";
import { runCLI } from "@web3api/test-env-js";

const testCaseRoot = path.join(GetPathToCliTestFiles(), "api/infra");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const HELP = `
w3 infra <command> <web3api-manifest> [options]

Commands:
  config  Validate and display Web3API infrastructure's bundled docker-compose manifest
  down     Stop Web3API infrastructure
  help     Show usage information
  up     Start Web3API infrastructure
  vars  Show Web3API infrastructure's required .env variables

Options:
  -m, --modules [<module-name>]       Use only specified modules
  -v, --verbose                      Verbose output (default: false)

`;

const portInUse = (port: number) => {
  return new Promise<boolean>((resolve) => {
    var server = net.createServer(function (socket) {
      socket.write("Echo server\r\n");
      socket.pipe(socket);
    });

    server.listen(port, "127.0.0.1");
    server.on("error", function () {
      resolve(true);
    });
    server.on("listening", function () {
      server.close();
      resolve(false);
    });
  });
};

const waitForPorts = (ports: { port: number; expected: boolean }[]) => {
  let tries = 0;

  return new Promise<boolean>((resolve, reject) => {
    const checkPorts = async () => {
      const results = await Promise.all(
        ports.map(async ({ port, expected }) => {
          const actual = await portInUse(port);

          return actual === expected;
        })
      );

      if (!results.some((r) => r === false)) {
        resolve(true);
      } else {
        if (tries > 10) {
          reject("Waiting for ports timed out");
        } else {
          tries++;
          setTimeout(checkPorts, 2000);
        }
      }
    };

    checkPorts();
  });
};

describe("e2e tests for infra command", () => {
  afterEach(async () => {
    await runCLI(
      {
        args: ["infra", "down", "web3api.yaml", "-v"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: false },
    ]);
  });

  test("Should throw error for no command given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["infra"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["infra", "help"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Extracts composed docker manifest's environment variable list", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["infra", "vars", "web3api.yaml"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("IPFS_PORT");
    expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
    expect(sanitizedOutput).toContain("ETH_TESTNET_PORT");
  });

  test("Validates and displays composed docker manifest", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["infra", "config", "web3api.yaml"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("services:");
    expect(sanitizedOutput).toContain("dev-server:");
    expect(sanitizedOutput).toContain("ipfs:");
  });

  test("Sets environment up with all modules if no --modules are passed", async () => {
    const {stderr, stdout} = await runCLI(
      {
        args: ["infra", "up", "web3api.yaml"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    console.log(stderr)
    console.log(stdout)

    await waitForPorts([
      { port: 3000, expected: true },
      { port: 4001, expected: true },
    ]);
  });

  test("Tears down environment", async () => {
    await runCLI(
      {
        args: ["infra", "up", "web3api.yaml"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    await waitForPorts([
      { port: 3000, expected: true },
      { port: 4001, expected: true },
    ]);

    await runCLI(
      {
        args: ["infra", "down", "web3api.yaml"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: false },
    ]);
  });

  test("Sets environment up with only selected modules", async () => {
    await runCLI(
      {
        args: ["infra", "up", "web3api.yaml", "--modules=ipfs"],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: true },
    ]);
  });

  test("Should throw error for --modules that don't exist in infra manifest", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: [
          "infra",
          "config",
          "web3api.yaml",
          "--modules=notExistingModule,alsoNotExisting",
        ],
        cwd: getTestCaseDir(0),
        cli: w3Cli
      },
    );

    expect(code).toEqual(1);
    expect(stderr).toContain(
      `Unrecognized modules: notExistingModule, alsoNotExisting`
    );
  });

  // test("Should setup and use default test env if no 'env' in manifest is provided", async () => {

  //   const envCachePath = path.join(__dirname, "..", "project", ".w3", "infra")

  //   if(fs.existsSync(envCachePath)) {
  //     rimraf.sync(envCachePath)
  //   }

  //   const { exitCode: code, stdout } = await runCLI(
  //     {
  //       args: [
  //         "infra",
  //         "config",
  //         "web3api.yaml",
  //       ],
  //       cwd: getTestCaseDir(0),
  //       cli: w3Cli
  //     },
  //   );

  //   const sanitizedOutput = clearStyle(stdout);

  //   expect(code).toEqual(0);
  //   expect(sanitizedOutput).toContain("services:");
  //   expect(sanitizedOutput).toContain("dev-server:");
  //   expect(sanitizedOutput).toContain("ipfs:");
  // })
});
