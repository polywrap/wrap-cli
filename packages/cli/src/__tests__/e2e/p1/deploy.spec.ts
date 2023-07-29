import { clearStyle, polywrapCli } from "../utils";

import { Commands, ETH_ENS_IPFS_MODULE_CONSTANTS } from "@polywrap/cli-js";
import { Uri } from "@polywrap/core-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import fs from "fs";
import yaml from "yaml";

const HELP = `Usage: polywrap deploy|d [options]

Deploys Polywrap Projects

Options:
  -m, --manifest-file <path>  Path to the Polywrap Deploy manifest file
                              (default: polywrap.deploy.yaml |
                              polywrap.deploy.yml)
  -o, --output-file <path>    Output file path for the deploy result
  -v, --verbose               Verbose output (default: false)
  -q, --quiet                 Suppress output (default: false)
  -l, --log-file [path]       Log file to save console output to
  -h, --help                  display help for command
`;

const testCaseRoot = path.join(GetPathToCliTestFiles(), "deploy");
  const testCases =
    fs.readdirSync(testCaseRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

const setup = async () => {
  await Commands.infra("down", {
    modules: ["eth-ens-ipfs"],
  })
  await Commands.infra("up", {
    modules: ["eth-ens-ipfs"],
  })
  // Wait a little longer just in case
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Setup environment variables
  process.env = {
    ...process.env,
    IPFS_GATEWAY_URI: ETH_ENS_IPFS_MODULE_CONSTANTS.ipfsProvider,
  };
}

jest.setTimeout(500000);

describe("e2e tests for deploy command", () => {
  beforeAll(async () => {
    await setup()
  });

  afterAll(async () => {
    await Commands.infra("down", {
      modules: ["eth-ens-ipfs"],
    })
  });

  it("Should show help text", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await Commands.deploy(
      { help: true }, {
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      },
    );

    expect(code).toEqual(0);
    expect(error).toBe("");
    expect(clearStyle(output)).toEqual(HELP);
  });

  it("Should deploy the project successfully", async () => {
    const { exitCode: code, stdout: output, stderr: error } = await Commands.deploy({}, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    const sanitizedOutput = clearStyle(output);
    const sanitizedError = clearStyle(error);

    expect(code).toEqual(0);
    expect(sanitizedError).toBeFalsy();
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_deploy'"
    );
  });

  it("Should output the deployment uri to URI.txt", async () => {
    const deploymentFilePath = path.join(getTestCaseDir(0), "URI.txt");
    if (fs.existsSync(deploymentFilePath)) {
      fs.unlinkSync(deploymentFilePath);
    }

    const { exitCode: code, stdout: output, stderr: error } = await Commands.deploy({}, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    expect(error).toBeFalsy();
    expect(code).toEqual(0);
    expect(fs.existsSync(deploymentFilePath)).toBeTruthy();

    const deploymentUri = fs.readFileSync(deploymentFilePath, "utf8");
    expect(() => Uri.from(deploymentUri)).not.toThrow();

    const sanitizedOutput = clearStyle(output);
    expect(sanitizedOutput).toContain(
      `The URI result from job fs_to_ipfs has been written to ${deploymentFilePath}. ` +
      "It is recommended to store this file at the root of your wrap package and commit it to your repository.",
    );
  });

  it("Should record successful deployments in the deployment log", async () => {
    const deploymentFilePath = path.join(getTestCaseDir(0), "URI.txt");
    const deployLogFilePath = path.join(getTestCaseDir(0), "/.polywrap/deploy/deploy.log");

    let entries = 0;
    if (fs.existsSync(deployLogFilePath)) {
      entries = fs.readFileSync(deployLogFilePath, "utf8").trim().split("\n").length;
    }

    const { exitCode: code, stderr: error } = await Commands.deploy({}, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    expect(error).toBeFalsy();
    expect(code).toEqual(0);

    const deployLog = fs.readFileSync(deployLogFilePath, "utf8").trim().split("\n");
    expect(deployLog.length).toEqual(entries + 1);

    const deploymentUri = fs.readFileSync(deploymentFilePath, "utf8");
    const lastLogEntry = deployLog[deployLog.length - 1];
    expect(lastLogEntry).toContain(deploymentUri);
  });

  it("Should output the results to a file if -o is passed", async () => {
    const yamlRes = await Commands.deploy({
      outputFile: "./output.yaml",
    }, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    expect(yamlRes.exitCode).toBe(0);

    const jsonRes = await Commands.deploy({
      outputFile: "./output.json",
    }, {
      cwd: getTestCaseDir(0),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    expect(jsonRes.exitCode).toBe(0);

    const yamlOutputFileContents = JSON.parse(
      JSON.stringify(
        (yaml.parse(
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
        "name": "fs_to_ipfs",
        "steps": [
          {
            "name": "ipfs_deploy",
            "id": "fs_to_ipfs.ipfs_deploy",
            "input": "wrap://fs/../wrapper",
            "result": "wrap://ipfs/QmcZJ1NudpTdF96NEJZiKnDDXhydqanTusw7DXGj7PfbxH",
          },
        ]
      },
    ])
  });

  it("Should show warning if no manifest ext is found in deploy package", async () => {
    const { exitCode: code, stdout: output } = await Commands.deploy({}, {
      cwd: getTestCaseDir(1),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    const sanitizedOutput = clearStyle(output);

    expect(code).toEqual(0);
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_test'"
    );
  });

  it("Should throw if manifest ext exists and config property is invalid", async () => {
    const { exitCode: code, stderr } = await Commands.deploy({}, {
      cwd: getTestCaseDir(2),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    const sanitizedErr = clearStyle(stderr);

    expect(code).toEqual(1);
    expect(sanitizedErr).toContain("gatewayUri is not of a type(s) string")
  });

  it("Should throw and stop chain if error is found", async () => {
    const { exitCode: code, stdout: output, stderr } = await Commands.deploy({}, {
      cwd: getTestCaseDir(3),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });

    const sanitizedOutput = clearStyle(output);
    const sanitizedErr = clearStyle(stderr);
    
    expect(sanitizedOutput).toContain(
      "Successfully executed step 'ipfs_deploy_1'"
    );
    expect(sanitizedOutput).not.toContain(
      "Successfully executed step 'from_deploy_3'"
    );
    expect(sanitizedErr.replace("\n", "")).toContain(
      "Failed to execute step 'ipfs_deploy_2'"
    );
    expect(code).toEqual(1);
  });

  it("Should throw if environment variable is not loaded but defined in manifest", async () => {
    const { exitCode: code, stderr } = await Commands.deploy({}, {
      cwd: getTestCaseDir(4),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });
    const sanitizedErr = clearStyle(stderr);
    expect(sanitizedErr).toContain("Environment variable not found: `NON_LOADED_VAR`");
    expect(code).toEqual(1);
  });
});
