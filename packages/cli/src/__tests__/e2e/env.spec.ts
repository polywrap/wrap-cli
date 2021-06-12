import fs from 'fs';
import path from "path";
import net from "net";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";
import rimraf from "rimraf";

const HELP = `
w3 env <command> <web3api-manifest> [options]

Commands:
  config  Validate and display Web3API environment's bundled docker-compose manifest
  down     Stop Web3API environment
  help     Show usage information
  up     Start Web3API environment
  vars  Show Web3API environment's required .env variables

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

describe("e2e tests for env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

  afterEach(async () => {
    await runCLI(
      {
        args: ["env", "down", "web3api.docker.yaml", "-v"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: false },
    ]);
  });

  test("Should throw error for no command given", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["env"],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(`No command given
${HELP}`);
  });

  test("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["env", "help"],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  test("Extracts composed docker manifest's environment variable list", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["env", "vars", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("IPFS_PORT");
    expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
    expect(sanitizedOutput).toContain("ETHEREUM_PORT");
  });

  test("Validates and displays composed docker manifest", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["env", "config", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("services:");
    expect(sanitizedOutput).toContain("dev-server:");
    expect(sanitizedOutput).toContain("ipfs:");
  });

  test("Sets environment up with all modules if no --modules are passed", async () => {
    await runCLI(
      {
        args: ["env", "up", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await waitForPorts([
      { port: 3000, expected: true },
      { port: 4001, expected: true },
    ]);
  });

  test("Tears down environment", async () => {
    await runCLI(
      {
        args: ["env", "up", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await waitForPorts([
      { port: 3000, expected: true },
      { port: 4001, expected: true },
    ]);

    await runCLI(
      {
        args: ["env", "down", "web3api.docker.yaml"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: false },
    ]);
  });

  test("Sets environment up with only selected modules", async () => {
    await runCLI(
      {
        args: ["env", "up", "web3api.docker.yaml", "--modules=ipfs"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await waitForPorts([
      { port: 3000, expected: false },
      { port: 4001, expected: true },
    ]);
  });

  test("Should throw error for --modules that don't exist in env manifest", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: [
          "env",
          "config",
          "web3api.docker.yaml",
          "--modules=notExistingModule,alsoNotExisting",
        ],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(1);
    expect(stderr).toContain(
      `Unrecognized modules: notExistingModule, alsoNotExisting`
    );
  });

  test("Should throw error for manifest with no 'dockerCompose' and no 'modules'", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: [
          "env",
          "config",
          "web3api.no-modules-docker.yaml",
        ],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(1);
    expect(stderr).toContain(
      `At least one is required in env manifest: "dockerCompose", "modules"`
    );
  });

  test.skip("Should tolerate manifest with no 'dockerCompose'", async () => {
    const { exitCode: code } = await runCLI(
      {
        args: [
          "env",
          "config",
          "web3api.no-env-docker.yaml",
        ],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
  });

  test("Should tolerate manifest with no 'modules'", async () => {
    const { exitCode: code } = await runCLI(
      {
        args: [
          "env",
          "config",
          "web3api.no-modules.yaml",
        ],
        cwd: projectRoot,
      },
      w3Cli
    );

    expect(code).toEqual(0);
  });

  test("Should setup and use default test env if no 'env' in manifest is provided", async () => {

    const envCachePath = path.join(__dirname, "..", "project", ".w3", "env")

    if(fs.existsSync(envCachePath)) {
      rimraf.sync(envCachePath)
    }

    const { exitCode: code, stdout } = await runCLI(
      {
        args: [
          "env",
          "config",
          "web3api.yaml",
        ],
        cwd: projectRoot,
      },
      w3Cli
    );

    const sanitizedOutput = clearStyle(stdout);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain("services:");
    expect(sanitizedOutput).toContain("dev-server:");
    expect(sanitizedOutput).toContain("ipfs:");
  })
});
