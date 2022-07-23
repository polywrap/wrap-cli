import fs from 'fs';
import path from "path";
import net from "net";
import { clearStyle, w3Cli } from "./utils";

import { GetPathToCliTestFiles } from "@web3api/test-cases";
import { runCLI } from "@web3api/test-env-js";

const testCaseRoot = path.join(GetPathToCliTestFiles(), "infra");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const HELP = `Usage: w3 infra|i <action> [options]

Manage infrastructure for your Web3API

Arguments:
  action                                   
    Infra allows you to execute the following commands:
    up      Start Web3API infrastructure
    down    Stop Web3API infrastructure
    config   Validate and display Web3API infrastructure's bundled docker-compose manifest
    vars     Show Web3API infrastructure's required .env variables
   (choices: "up", "down", "vars", "config")

Options:
  --manifest  <manifest>                   Infra Manifest path (default: "web3api.infra.yaml")
  -m, --modules <module-name,module-name>  Use only specified modules
  -v, --verbose                            Verbose output (default: false)
  -h, --help                               display help for command
`;

const portInUse = (port: number) => {
  return new Promise<boolean>((resolve) => {
    var server = net.createServer(function (socket) {
      socket.write("Echo server\r\n");
      socket.pipe(socket);
    });

    server.listen(port, "127.0.0.1");
    server.on("error", function () {
      server.close(() => resolve(true));
    });
    server.on("listening", function () {
      server.close(() => resolve(false));
    });
  });
};

const waitForPorts = (ports: { port: number; expected: boolean }[]) => {
  let tries = 0;
  const maxTries = 10;

  return new Promise<boolean>((resolve, reject) => {
    const checkPorts = async () => {
      const results = await Promise.all(
        ports.map(async ({ port, expected }) => {
          const actual = await portInUse(port);

          return actual === expected;
        })
      );

      if (!results.some((r) => !r)) {
        resolve(true);
      } else {
        if (tries > maxTries) {
          const failed = results.map(
            (value, index) => value ? index : -1
          ).filter((x) => x > -1);
          reject(
            `Waiting for ports timed out: \n` +
            JSON.stringify(failed.map((index) => ports[index]))
          );
        } else {
          tries++;
          setTimeout(checkPorts, 2000);
        }
      }
    };

    checkPorts();
  });
};

const runW3CLI = (args: string[], cwd: string) =>
  runCLI({
    args,
    cwd,
    cli: w3Cli,
    env: process.env as Record<string, string>
  });

describe("e2e tests for infra command", () => {
  beforeAll(() => {
    process.env = {
      ...process.env,
      ENV_IPFS_PORT: "5001",
      IPFS_PORT: "5001",
      ETHEREUM_PORT: "8545",
      DEV_SERVER_ETH_TESTNET_PORT: "8646",
      DEV_SERVER_PORT: "4040"
    };
  });

  describe("Sanity", () => {
    afterEach(async () => {
      await runW3CLI(
          ["infra", "down", "-v"],
          getTestCaseDir(0),
      );

      await runW3CLI(
        ["infra", "down", "-v", "--modules=eth-ens-ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false }
      ]);
    });

    test("Should throw error for no command given", async () => {
      const { exitCode: code, stderr: error } = await runW3CLI(
        ["infra"],
        getTestCaseDir(0),
      );

      expect(code).toEqual(1);
      expect(error).toContain(`error: missing required argument 'action'`);
    });

    test("Should show help text", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runW3CLI(
        ["infra", "--help"],
        getTestCaseDir(0),
      );

      expect(code).toEqual(0);
      expect(error).toBe("");
      expect(clearStyle(output)).toEqual(HELP);
    });

    test("Extracts composed docker manifest's environment variable list", async () => {
      const { exitCode: code, stdout: output } = await runW3CLI(
        ["infra", "vars"],
        getTestCaseDir(0),
      );

      const sanitizedOutput = clearStyle(output);

      expect(code).toEqual(0);
      expect(sanitizedOutput).toContain("IPFS_PORT");
      expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
      expect(sanitizedOutput).toContain("DEV_SERVER_ETH_TESTNET_PORT");
    });

    test("Validates and displays composed docker manifest", async () => {
      const { exitCode: code, stdout: output } = await runW3CLI(
        ["infra", "config"],
        getTestCaseDir(0),
      );

      const sanitizedOutput = clearStyle(output);

      expect(code).toEqual(0);
      expect(sanitizedOutput).toContain("services:");
      expect(sanitizedOutput).toContain("dev-server:");
      expect(sanitizedOutput).toContain("ipfs:");
    });

    test("Sets environment up with all modules if no --modules are passed", async () => {
      await runW3CLI(
        ["infra", "down", "--manifest=./web3api.infra.yaml"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false }
      ]);

      await runW3CLI(
        ["infra", "up", "--manifest=./web3api.infra.yaml"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: true },
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);
    });

    test("Should correctly fetch default & local module", async () => {
      await runW3CLI(
        ["infra", "up"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8546, expected: true },
      ]);

      await runW3CLI(
        ["infra", "down"],
        getTestCaseDir(4),
      );
    });

    test("Should correctly open one process for default module because modules flag overwrites it", async () => {
      await runW3CLI(
        ["infra", "up", "--modules=eth-ens-ipfs"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
      ]);

      await runW3CLI(
        ["infra", "down", "--modules=eth-ens-ipfs"],
        getTestCaseDir(4),
      );
    });

    test("Should throw because default module declared in manifest is not recognized", async () => {
      const { stderr } = await runW3CLI(
        ["infra", "up", "--manifest=./web3api.infra.wrong.yaml"],
        getTestCaseDir(4),
      );

      expect(stderr).toContain(
        `Module random-module not found as default\nDefault Modules available: `
      );
    });

    test("Should correctly fetch different local modules when they are declared as folder or file", async () => {
      await runW3CLI(
        ["infra", "up"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8546, expected: true },
        { port: 8547, expected: true },
      ]);

      await runW3CLI(
        ["infra", "down"],
        getTestCaseDir(4),
      );
    });

    test("Tears down environment", async () => {
      await runW3CLI(
        ["infra", "up"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: true },
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);

      await runW3CLI(
        ["infra", "down"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false },
      ]);
    });

    test("Sets environment up with only selected modules", async () => {
      await runW3CLI(
        ["infra", "up", "--modules=ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: true },
        { port: 8545, expected: false }
      ]);

      await runW3CLI(
        ["infra", "down", "--modules=ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 5001, expected: false }
      ]);
    });

    test("Should throw error for --modules that don't exist in infra manifest and are not default modules", async () => {
      const { exitCode: code, stderr } = await runW3CLI(
        [
          "infra",
          "config",
          "--modules=notExistingModule,alsoNotExisting",
        ],
        getTestCaseDir(0),
      );

      expect(code).toEqual(1);
      expect(stderr).toContain(
        `Unrecognized modules: notExistingModule, alsoNotExisting`
      );
    });

    test("Should setup and use a default module if --modules arg is passed and the module does not exist in the manifest", async () => {
      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);
    })

    test("If a module declared in manifest has the same name of a default module, the manifest's should take precedence", async () => {
      const { stdout: withManifestModOutput } = await runW3CLI(
        [
          "infra",
          "config",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(2),
      );

      const withManifestModSanitizedOutput = clearStyle(withManifestModOutput);

      expect(withManifestModSanitizedOutput).toContain("dev-server:")

      const { stdout: withoutManifestModOutput } = await runW3CLI(
        [
          "infra",
          "config",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(0),
      );

      const withoutManifestModSanitizedOutput = clearStyle(withoutManifestModOutput);

      expect(withoutManifestModSanitizedOutput).not.toContain("dev-server:")
    })

    test("Should set up a default environment if no manifest is present, but --modules option is passed", async () => {
      
      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(3),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);
    })

    test("Should not include default modules if no --modules option is passed and manifest exists", async () => {
      
      const { stdout } = await runW3CLI(
        [
          "infra",
          "config",
          "--verbose"
        ],
        getTestCaseDir(0),
      );

      const output = clearStyle(stdout);

      expect(output).not.toContain("ens-scripts")
    })

    test("Should fail if no manifest is present and no --modules option is passed", async () => {
      
      const { exitCode, stderr } = await runW3CLI(
        [
          "infra",
          "config",
          "--verbose"
        ],
        getTestCaseDir(3),
      );

      expect(exitCode).toBe(1)
      expect(stderr).toContain("If no infra manifest is specified, a default module should be specified using the '--modules' option")
    })
  });

  describe("Duplicates", () => {
    test("Should handle duplicate services", async () => {
      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=ganache,dev-server"
        ],
        getTestCaseDir(1),
      );

      await waitForPorts([
        { port: 8546, expected: true },
        { port: 8545, expected: true }
      ]);

      await runW3CLI(
        ["infra", "down", "--modules=ganache,dev-server"],
        getTestCaseDir(1),
      );
    });

    test("Should correctly duplicate pkg in different module", async () => {
      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=ipfs,ipfs-duplicate"
        ],
        getTestCaseDir(1),
      );
  
      await waitForPorts([
        { port: 5001, expected: true },
      ]);

      await runW3CLI(
        ["infra", "down", "--modules=ipfs,ipfs-duplicate"],
        getTestCaseDir(1),
      );
    });
  });

  describe("Default modules", () => {

    test("Tezos", async () => {
      process.env = {
        ...process.env,
        TEZOS_POLYWRAP_PORT: "2000",
        TEZOS_POLYWRAP_BLOCK_TIME: "5",
        TEZOS_POLYWRAP_PROTOCOL: "Jakarta"
      };

      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=tezos",
          "--verbose"
        ],
        getTestCaseDir(3),
      );
  
      await waitForPorts([
        { port: 2000, expected: true }
      ]);

      await runW3CLI(
        [
          "infra",
          "down",
          "--modules=tezos",
          "--verbose"
        ],
        getTestCaseDir(3),
      );
    })

    test("Ethereum, Ens, IPFS", async () => {
      process.env = {
        ...process.env,
        IPFS_PORT: "5001",
        ETHEREUM_PORT: "8545",
      };
      
      await runW3CLI(
        [
          "infra",
          "up",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(3),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);

      await runW3CLI(
        [
          "infra",
          "down",
          "--modules=eth-ens-ipfs",
          "--verbose"
        ],
        getTestCaseDir(3),
      );
    })
  })
})
