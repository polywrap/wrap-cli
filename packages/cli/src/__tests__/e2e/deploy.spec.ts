import { clearStyle, polywrapCli } from "./utils";

import { 
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";

const HELP = `Usage: polywrap deploy|d [options]

Deploys Polywrap Projects

Options:
  -m, --manifest-file <path>  Path to the Polywrap Deploy manifest file
                              (default: polywrap.yaml | polywrap.yml)
  -o, --output-file <path>    Output file path for the deploy result
  -v, --verbose               Verbose output (default: false)
  -h, --help                  display help for command
`;

const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/deploy");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const setup = async () => {
  await stopTestEnvironment();
  await initTestEnvironment();

  // Wait a little longer just in case
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Setup environment variables
  process.env = {
    ...process.env,
    IPFS_GATEWAY_URI: providers.ipfs,
    DOMAIN_NAME: "test1.eth",
    ENS_REG_ADDR: ensAddresses.ensAddress,
    ENS_REGISTRAR_ADDR: ensAddresses.registrarAddress,
    ENS_RESOLVER_ADDR: ensAddresses.resolverAddress,
  };
}

describe("e2e tests for deploy command", () => {
  beforeAll(async () => {
    await setup()

    for (let i = 0; i < testCases.length; ++i) {
      await runCLI(
        {
          args: ["build", "-v"],
          cwd: getTestCaseDir(i),
          cli: polywrapCli,
        },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy", "--help"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should deploy the project successfully", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(error).toBeFalsy();
    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_deploy'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'from_deploy'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'from_deploy2'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed 'fs_to_ens' deployment job"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'from_uri'"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed 'ipfs_to_ens' deployment job"
    );
  });

  it("Should output the results to a file if -o is passed", async () => {
    await runCLI(
      {
        args: ["deploy", "-o", "./output.yaml"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    await runCLI(
      {
        args: ["deploy", "-o", "./output.json"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );
    
    const yamlOutputFileContents = JSON.parse(
      JSON.stringify(
        (yaml.load(
          fs.readFileSync(
            path.join(getTestCaseDir(0), "output.yaml"),
            "utf8"
          )
        ) as unknown) as Array<unknown>
      )
    )

    const jsonOutputFileContents = JSON.parse(
      fs.readFileSync(
        path.join(getTestCaseDir(0), "output.json"),
        "utf8"
      )
    )

    fs.unlinkSync(path.join(getTestCaseDir(0), "output.yaml"))
    fs.unlinkSync(path.join(getTestCaseDir(0), "output.json"))

    expect(yamlOutputFileContents).toMatchObject(jsonOutputFileContents);
    expect(jsonOutputFileContents).toMatchObject([
      {
        "name": "fs_to_ens",
        "steps": [
          {
            "name": "ens_register",
            "id": "fs_to_ens.ens_register",
            "input": {
              "_config": {
                "uri": "wrap://ens/test1.eth",
                "authority": "ens",
                "path": "test1.eth"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test1.eth",
                "authority": "ens",
                "path": "testnet/test1.eth"
              }
            }
          },
          {
            "name": "ens_register2",
            "id": "fs_to_ens.ens_register2",
            "input": {
              "_config": {
                "uri": "wrap://ens/test2.eth",
                "authority": "ens",
                "path": "test2.eth"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test2.eth",
                "authority": "ens",
                "path": "testnet/test2.eth"
              }
            }
          },
          {
            "name": "ipfs_deploy",
            "id": "fs_to_ens.ipfs_deploy",
            "input": {
              "_config": {
                "uri": "wrap://fs/./build",
                "authority": "fs",
                "path": "./build"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG",
                "authority": "ipfs",
                "path": "QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG"
              }
            }
          },
          {
            "name": "from_deploy",
            "id": "fs_to_ens.from_deploy",
            "input": {
              "_config": {
                "uri": "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG",
                "authority": "ipfs",
                "path": "QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test1.eth",
                "authority": "ens",
                "path": "testnet/test1.eth"
              }
            }
          },
          {
            "name": "from_deploy2",
            "id": "fs_to_ens.from_deploy2",
            "input": {
              "_config": {
                "uri": "wrap://ipfs/QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG",
                "authority": "ipfs",
                "path": "QmT5nBb8xwrfZnmFNRZexmrebzaaxW7CPfh1ZznQ6zsVaG"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test2.eth",
                "authority": "ens",
                "path": "testnet/test2.eth"
              }
            }
          }
        ]
      },
      {
        "name": "ipfs_to_ens",
        "steps": [
          {
            "name": "ens_register",
            "id": "ipfs_to_ens.ens_register",
            "input": {
              "_config": {
                "uri": "wrap://ens/test3.eth",
                "authority": "ens",
                "path": "test3.eth"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test3.eth",
                "authority": "ens",
                "path": "testnet/test3.eth"
              }
            }
          },
          {
            "name": "from_uri",
            "id": "ipfs_to_ens.from_uri",
            "input": {
              "_config": {
                "uri": "wrap://ipfs/QmVdDR6QtigTt38Xwpj2Ki73X1AyZn5WRCreBCJq1CEtpF",
                "authority": "ipfs",
                "path": "QmVdDR6QtigTt38Xwpj2Ki73X1AyZn5WRCreBCJq1CEtpF"
              }
            },
            "result": {
              "_config": {
                "uri": "wrap://ens/testnet/test3.eth",
                "authority": "ens",
                "path": "testnet/test3.eth"
              }
            }
          }
        ]
      }
    ])
  });

  it("Should show warning if no manifest ext is found in deploy package", async () => {
    const { exitCode: code, stdout: output } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(1),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "No manifest extension found in"
    );
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_test'"
    );
  });

  it("Should throw if manifest ext exists and config property is invalid", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(2),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("domainName is not of a type(s) string")
  });

  it("Should throw and stop chain if error is found", async () => {
    const { exitCode: code, stdout: output, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(3),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedOutput = clearStyle(output);
    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_deploy'"
    );
    expect(sanitizedOutput).not.toContain(
      "Successfully executed step 'from_deploy2'"
    );

    expect(sanitizedErr).toContain(
      "Failed to execute step 'from_deploy'"
    );
  });

  it("Should throw if environment variable is not loaded but defined in manifest", async () => {
    const { exitCode: code, stderr } = await runCLI(
      {
        args: ["deploy"],
        cwd: getTestCaseDir(4),
        cli: polywrapCli,
        env: process.env as Record<string, string>
      },
    );

    const sanitizedErr = clearStyle(stderr);
    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("Environment variable not found: `NON_LOADED_VAR`");
  });
});
