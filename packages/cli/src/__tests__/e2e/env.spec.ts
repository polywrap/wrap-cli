import path from "path";
import net from "net";
import { clearStyle, w3Cli } from "./utils";

import { runCLI } from "@web3api/test-env-js";

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

describe("e2e tests for env command", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

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
        args: ["env", "up", "web3api.docker.yaml", "-v"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await new Promise(async (resolve) => {
      const checkPorts = async () => {
        const isDevserverUp = await portInUse(3000);
        const isIpfsUp = await portInUse(4001);

        if (isDevserverUp && isIpfsUp) {
          resolve(true);
        } else {
          setTimeout(checkPorts, 2000);
        }
      };

      checkPorts();
    });
  });

  test("Tears down environment", async () => {
    await runCLI(
      {
        args: ["env", "down", "web3api.docker.yaml", "-v"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await new Promise(async (resolve) => {
      const checkPorts = async () => {
        const isDevserverUp = await portInUse(3000);
        const isIpfsUp = await portInUse(4001);

        if (!isDevserverUp && !isIpfsUp) {
          resolve(true);
        } else {
          setTimeout(checkPorts, 2000);
        }
      };

      checkPorts();
    });
  });

  test("Sets environment up with only selected modules", async () => {
    await runCLI(
      {
        args: ["env", "up", "web3api.docker.yaml", "--modules=ipfs"],
        cwd: projectRoot,
      },
      w3Cli
    );

    await new Promise(async (resolve) => {
      const checkPorts = async () => {
        const isDevserverUp = await portInUse(3000);
        const isIpfsUp = await portInUse(4001);

        if (!isDevserverUp && isIpfsUp) {
          resolve(true);
        } else {
          setTimeout(checkPorts, 2000);
        }
      };

      checkPorts();
    });
  });
});
