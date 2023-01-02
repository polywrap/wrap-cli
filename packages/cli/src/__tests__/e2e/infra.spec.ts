import fs from 'fs';
import path from "path";
import net from "net";
import { clearStyle, polywrapCli } from "./utils";

import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { runCLI } from "@polywrap/test-env-js";

const testCaseRoot = path.join(GetPathToCliTestFiles(), "infra");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const HELP = `Usage: polywrap infra|i <action> [options]

Modular Infrastructure-As-Code Orchestrator

Arguments:
  action                       
    Infra allows you to execute the following commands:
    up      Start Polywrap infrastructure
    down    Stop Polywrap infrastructure
    config   Validate and display Polywrap infrastructure's bundled docker-compose manifest
    vars     Show Polywrap infrastructure's required .env variables
   (choices: "up", "down", "vars", "config")

Options:
  -m, --manifest-file  <path>  Path to the Polywrap Infra manifest file
                               (default: polywrap.infra.yaml |
                               polywrap.infra.yml)
  -o, --modules <module...>    Use only specified modules
  -v, --verbose                Verbose output (default: false)
  -q, --quiet                  Suppress output (default: false)
  -l, --log-file [path]        Log file to save console output to
  -h, --help                   display help for command
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

const runPolywrapCli = (args: string[], cwd: string) =>
  runCLI({
    args,
    cwd,
    cli: polywrapCli,
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
      await runPolywrapCli(
          ["infra", "down", "-v"],
          getTestCaseDir(0),
      );

      await runPolywrapCli(
        ["infra", "down", "-v", "--modules=eth-ens-ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false }
      ]);
    });

    it("Should throw error for no command given", async () => {
      const { exitCode: code, stderr: error } = await runPolywrapCli(
        ["infra"],
        getTestCaseDir(0),
      );

      expect(code).toEqual(1);
      expect(error).toContain(`error: missing required argument 'action'`);
    });

    it("Should show help text", async () => {
      const { exitCode: code, stdout: output, stderr: error } = await runPolywrapCli(
        ["infra", "--help"],
        getTestCaseDir(0),
      );

      expect(code).toEqual(0);
      expect(error).toBe("");
      expect(clearStyle(output)).toEqual(HELP);
    });

    it("Should extract composed docker manifest's environment variable list", async () => {
      const { exitCode: code, stdout: output } = await runPolywrapCli(
        ["infra", "vars"],
        getTestCaseDir(0),
      );

      const sanitizedOutput = clearStyle(output);

      expect(code).toEqual(0);
      expect(sanitizedOutput).toContain("IPFS_PORT");
      expect(sanitizedOutput).toContain("DEV_SERVER_PORT");
      expect(sanitizedOutput).toContain("DEV_SERVER_ETH_TESTNET_PORT");
    });

    it("Should validate and display composed docker manifest", async () => {
      const { exitCode: code, stdout: output } = await runPolywrapCli(
        ["infra", "config"],
        getTestCaseDir(0),
      );

      const sanitizedOutput = clearStyle(output);

      expect(code).toEqual(0);
      expect(sanitizedOutput).toContain("services:");
      expect(sanitizedOutput).toContain("dev-server:");
      expect(sanitizedOutput).toContain("ipfs:");
    });

    it("Should set environment up with all modules if no --modules are passed", async () => {
      await runPolywrapCli(
        ["infra", "down", "--manifest-file=./polywrap.infra.yaml"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false }
      ]);

      await runPolywrapCli(
        ["infra", "up", "--manifest-file=./polywrap.infra.yaml"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: true },
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);
    });

    it("Should correctly fetch default & local module", async () => {
      await runPolywrapCli(
        ["infra", "up"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8546, expected: true },
      ]);

      await runPolywrapCli(
        ["infra", "down"],
        getTestCaseDir(4),
      );
    });

    it("Should correctly open one process for default module because modules flag overwrites it", async () => {
      await runPolywrapCli(
        ["infra", "up", "--modules=eth-ens-ipfs"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
      ]);

      await runPolywrapCli(
        ["infra", "down", "--modules=eth-ens-ipfs"],
        getTestCaseDir(4),
      );
    });

    it("Should throw because default module declared in manifest is not recognized", async () => {
      const { stderr } = await runPolywrapCli(
        ["infra", "up", "--manifest-file=./polywrap.infra.wrong.yaml"],
        getTestCaseDir(4),
      );

      expect(stderr).toContain(
        `Module random-module not found as default\nDefault Modules available: `
      );
    });

    it("Should correctly fetch different local modules when they are declared as folder or file", async () => {
      await runPolywrapCli(
        ["infra", "up"],
        getTestCaseDir(4),
      );

      await waitForPorts([
        { port: 5001, expected: true },
        { port: 8546, expected: true },
        { port: 8547, expected: true },
      ]);

      await runPolywrapCli(
        ["infra", "down"],
        getTestCaseDir(4),
      );
    });

    it("Should tear down environment", async () => {
      await runPolywrapCli(
        ["infra", "up"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: true },
        { port: 5001, expected: true },
        { port: 8545, expected: true }
      ]);

      await runPolywrapCli(
        ["infra", "down"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: false },
        { port: 8545, expected: false },
      ]);
    });

    it("Should set environment up with only selected modules", async () => {
      await runPolywrapCli(
        ["infra", "up", "--modules=ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 4040, expected: false },
        { port: 5001, expected: true },
        { port: 8545, expected: false }
      ]);

      await runPolywrapCli(
        ["infra", "down", "--modules=ipfs"],
        getTestCaseDir(0),
      );

      await waitForPorts([
        { port: 5001, expected: false }
      ]);
    });

    it("Should throw error for --modules that don't exist in infra manifest and are not default modules", async () => {
      const { exitCode: code, stderr } = await runPolywrapCli(
        [
          "infra",
          "config",
          "--modules notExistingModule alsoNotExisting",
        ],
        getTestCaseDir(0),
      );

      expect(code).toEqual(1);
      expect(stderr).toContain(
        `Unrecognized modules: notExistingModule, alsoNotExisting`
      );
    });

    it("Should setup and use a default module if --modules arg is passed and the module does not exist in the manifest", async () => {
      await runPolywrapCli(
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
      const { stdout: withManifestModOutput } = await runPolywrapCli(
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

      const { stdout: withoutManifestModOutput } = await runPolywrapCli(
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

    it("Should set up a default environment if no manifest is present, but --modules option is passed", async () => {
      
      await runPolywrapCli(
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

    it("Should not include default modules if no --modules option is passed and manifest exists", async () => {
      
      const { stdout } = await runPolywrapCli(
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

    it("Should fail if no manifest is present and no --modules option is passed", async () => {
      
      const { exitCode, stderr } = await runPolywrapCli(
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
    it("Should handle duplicate services", async () => {
      await runPolywrapCli(
        [
          "infra",
          "up",
          "--modules=ganache dev-server"
        ],
        getTestCaseDir(1),
      );

      await waitForPorts([
        { port: 8546, expected: true },
        { port: 8545, expected: true }
      ]);

      await runPolywrapCli(
        ["infra", "down", "--modules=ganache dev-server"],
        getTestCaseDir(1),
      );
    });

    it("Should correctly duplicate pkg in different module", async () => {
      await runPolywrapCli(
        [
          "infra",
          "up",
          "--modules=ipfs ipfs-duplicate"
        ],
        getTestCaseDir(1),
      );
  
      await waitForPorts([
        { port: 5001, expected: true },
      ]);

      await runPolywrapCli(
        ["infra", "down", "--modules=ipfs ipfs-duplicate"],
        getTestCaseDir(1),
      );
    });
  });
})
