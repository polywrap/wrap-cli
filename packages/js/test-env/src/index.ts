/* eslint-disable @typescript-eslint/naming-convention */
import { generateName } from "./generate-name";

import path from "path";
import spawn from "spawn-command";
import axios from "axios";
import fs from "fs";
import yaml from "yaml";
import { Uri } from "@polywrap/core-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

// $start: ensAddresses
/** The Ethereum addresses of the default infrastructure module's locally-deployed ENS smart contracts. */
export const ensAddresses = {
  ensAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  resolverAddress: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  registrarAddress: "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
  reverseAddress: "0xe982E462b094850F12AF94d21D470e21bE9D0E9C",
} as const;
// $end

// $start: providers
/** The URIs for the default providers used by the default infrastructure module. */
export const providers = {
  ipfs: "http://localhost:5001",
  ethereum: "http://localhost:8545",
  http: "http://localhost:3500",
};
// $end

// $start: embeddedWrappers
/** Wasm wrappers embedded in the package */
export const embeddedWrappers = {
  ens: `wrap://fs/${path.join(__dirname, "wrappers", "ens")}`,
  uts46: `wrap://fs/${path.join(__dirname, "wrappers", "uts46")}`,
  sha3: `wrap://fs/${path.join(__dirname, "wrappers", "sha3")}`,
};
// $end: embeddedWrappers

const monorepoCli = `${__dirname}/../../../cli/bin/polywrap`;
const npmCli = `${__dirname}/../../../polywrap/bin/polywrap`;

async function awaitResponse(
  url: string,
  expectedRes: string,
  getPost: "get" | "post",
  timeout: number,
  maxTimeout: number,
  data?: string
) {
  let time = 0;

  while (time < maxTimeout) {
    const request = getPost === "get" ? axios.get(url) : axios.post(url, data);
    const success = await request
      .then(function (response) {
        const responseData = JSON.stringify(response.data);
        return responseData.indexOf(expectedRes) > -1;
      })
      .catch(function () {
        return false;
      });

    if (success) {
      return true;
    }

    await new Promise<void>(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}

// $start: initTestEnvironment
/**
 * Starts a local test environment using the default infrastructure module.
 *
 * @param cli? - a path to a Polywrap CLI binary.
 */
export const initTestEnvironment = async (
  cli?: string
): Promise<void> /* $ */ => {
  // Start the test environment
  const { exitCode, stderr, stdout } = await runCLI({
    args: ["infra", "up", "--modules=eth-ens-ipfs", "--verbose"],
    cli,
  });

  if (exitCode) {
    throw Error(
      `initTestEnvironment failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  // Wait for all endpoints to become available
  let success = false;

  // IPFS
  success = await awaitResponse(
    `http://localhost:5001/api/v0/version`,
    '"Version":',
    "get",
    2000,
    20000
  );

  if (!success) {
    throw Error("test-env: IPFS failed to start");
  }

  // Ganache
  success = await awaitResponse(
    `http://localhost:8545`,
    '"jsonrpc":',
    "post",
    2000,
    20000,
    '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
  );

  if (!success) {
    throw Error("test-env: Ganache failed to start");
  }

  // ENS
  success = await awaitResponse(
    "http://localhost:8545",
    '"result":"0x',
    "post",
    2000,
    20000,
    `{"jsonrpc":"2.0","method":"eth_getCode","params":["${ensAddresses.ensAddress}", "0x2"],"id":1}`
  );

  if (!success) {
    throw Error("test-env: ENS failed to deploy");
  }
};

// $start: stopTestEnvironment
/**
 * Stops the local test environment (default infrastructure module) if one is running.
 *
 * @param cli? - a path to a Polywrap CLI binary.
 */
export const stopTestEnvironment = async (
  cli?: string
): Promise<void> /* $ */ => {
  // Stop the test environment
  const { exitCode, stderr } = await runCLI({
    args: ["infra", "down", "--modules=eth-ens-ipfs"],
    cli,
  });

  if (exitCode) {
    throw Error(
      `stopTestEnvironment failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}`
    );
  }

  return Promise.resolve();
};

// $start: runCLI
/**
 * Runs the polywrap CLI programmatically.
 *
 * @param options - an object containing:
 *   args - an array of command line arguments
 *   cwd? - a current working directory
 *   cli? - a path to a Polywrap CLI binary
 *   env? - a map of environmental variables
 *
 * @returns exit code, standard output, and standard error logs
 */
export const runCLI = async (options: {
  args: string[];
  cwd?: string;
  cli?: string;
  env?: Record<string, string>;
}): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> /* $ */ => {
  const [exitCode, stdout, stderr] = await new Promise((resolve, reject) => {
    if (!options.cwd) {
      // Make sure to set an absolute working directory
      const cwd = process.cwd();
      options.cwd = cwd[0] !== "/" ? path.resolve(__dirname, cwd) : cwd;
    }

    // Resolve the CLI
    if (!options.cli) {
      if (fs.existsSync(monorepoCli)) {
        options.cli = monorepoCli;
      } else if (fs.existsSync(npmCli)) {
        options.cli = npmCli;
      } else {
        throw Error(`runCli is missing a valid CLI path, please provide one`);
      }
    }

    const command = `node ${options.cli} ${options.args.join(" ")}`;
    const child = spawn(command, { cwd: options.cwd, env: options.env });

    let stdout = "";
    let stderr = "";

    child.on("error", (error: Error) => {
      reject(error);
    });

    child.stdout?.on("data", (data: string) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data: string) => {
      stderr += data.toString();
    });

    child.on("exit", (exitCode: number) => {
      resolve([exitCode, stdout, stderr]);
    });
  });

  return {
    exitCode,
    stdout,
    stderr,
  };
};

// $start: buildWrapper
/**
 * Build the wrapper located at the given path
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param manifestPathOverride? - path to polywrap manifest
 * @param codegen? - run codegen before build
 */
export async function buildWrapper(
  wrapperAbsPath: string,
  manifestPathOverride?: string,
  codegen?: boolean
): Promise<void> /* $ */ {
  const manifestPath = manifestPathOverride
    ? path.join(wrapperAbsPath, manifestPathOverride)
    : `${wrapperAbsPath}/polywrap.yaml`;

  if (codegen) {
    const {
      exitCode: codegenExitCode,
      stdout: codegenStdout,
      stderr: codegenStderr,
    } = await runCLI({
      args: ["codegen", "--manifest-file", manifestPath],
      cwd: wrapperAbsPath,
    });

    if (codegenExitCode != 0) {
      console.error(`polywrap exited with code: ${codegenExitCode}`);
      console.log(`stderr:\n${codegenStdout}`);
      console.log(`stdout:\n${codegenStderr}`);
      throw Error("polywrap CLI failed");
    }
  }

  const {
    exitCode: buildExitCode,
    stdout: buildStdout,
    stderr: buildStderr,
  } = await runCLI({
    args: [
      "build",
      "--manifest-file",
      manifestPath,
      "--output-dir",
      `${wrapperAbsPath}/build`,
    ],
  });

  if (buildExitCode !== 0) {
    console.error(`polywrap exited with code: ${buildExitCode}`);
    console.log(`stderr:\n${buildStderr}`);
    console.log(`stdout:\n${buildStdout}`);
    throw Error("polywrap CLI failed");
  }
}

// $start: buildAndDeployWrapper
/**
 * Build the wrapper located at the given path, and then deploy it to IPFS and ENS.
 * If an ENS domain is not provided, a randomly selected human-readable ENS domain name is used.
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param ipfsProvider - ipfs provider to use for deployment
 * @param ethereumProvider - ethereum provider to use for ENS registration
 * @param ensName? - an ENS domain name to register and assign to the wrapper
 * @param codegen? - run codegen before build
 *
 * @returns registered ens domain name and IPFS hash
 */
export async function buildAndDeployWrapper({
  wrapperAbsPath,
  ipfsProvider,
  ethereumProvider,
  ensName,
  codegen,
}: {
  wrapperAbsPath: string;
  ipfsProvider: string;
  ethereumProvider: string;
  ensName?: string;
  codegen?: boolean;
}): Promise<{
  ensDomain: string;
  ipfsCid: string;
}> /* $ */ {
  const tempDeployManifestFilename = `polywrap.deploy-temp.yaml`;
  const tempDeployManifestPath = path.join(
    wrapperAbsPath,
    tempDeployManifestFilename
  );

  // create a new ENS domain
  const wrapperEns = ensName ?? `${generateName()}.eth`;

  await buildWrapper(wrapperAbsPath, undefined, codegen);

  const deployManifest: Omit<DeployManifest, "__type"> = {
    format: "0.2.0",
    jobs: {
      buildAndDeployWrapper: {
        config: {
          provider: ethereumProvider,
          ensRegistryAddress: ensAddresses.ensAddress,
          ensRegistrarAddress: ensAddresses.registrarAddress,
          ensResolverAddress: ensAddresses.resolverAddress,
        },
        steps: [
          {
            name: "registerName",
            package: "ens-recursive-name-register",
            uri: `wrap://ens/${wrapperEns}`,
          },
          {
            name: "ipfsDeploy",
            package: "ipfs",
            uri: `fs/${wrapperAbsPath}/build`,
            config: {
              gatewayUri: ipfsProvider,
            },
          },
          {
            name: "ensPublish",
            package: "ens",
            uri: "$$ipfsDeploy",
            config: {
              domainName: wrapperEns,
            },
          },
        ],
      },
    },
  };
  fs.writeFileSync(
    tempDeployManifestPath,
    yaml.stringify(deployManifest, null, 2)
  );

  // deploy Wrapper

  const {
    exitCode: deployExitCode,
    stdout: deployStdout,
    stderr: deployStderr,
  } = await runCLI({
    args: ["deploy", "--manifest-file", tempDeployManifestPath],
  });

  if (deployExitCode !== 0) {
    console.error(`polywrap exited with code: ${deployExitCode}`);
    console.log(`stderr:\n${deployStderr}`);
    console.log(`stdout:\n${deployStdout}`);
    throw Error("polywrap CLI failed");
  }

  // remove manually configured manifests
  fs.unlinkSync(tempDeployManifestPath);

  // get the IPFS CID of the published package
  const extractCID = /(wrap:\/\/ipfs\/[A-Za-z0-9]+)/;
  const result = deployStdout.match(extractCID);

  if (!result) {
    throw Error(
      `polywrap CLI output missing IPFS CID.\nOutput: ${deployStdout}`
    );
  }

  const wrapperCid = new Uri(result[1]).path;

  return {
    ensDomain: wrapperEns,
    ipfsCid: wrapperCid,
  };
}

// $start: buildAndDeployWrapperToHttp
/**
 * Build the wrapper located at the given path, and then deploy it to HTTP.
 * If a domain name is not provided, a randomly selected human-readable domain name is used.
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param httpProvider - http provider used for deployment and domain registration
 * @param name? - a domain name to register and assign to the wrapper
 * @param codegen? - run codegen before build
 *
 * @returns http uri
 */
export async function buildAndDeployWrapperToHttp({
  wrapperAbsPath,
  httpProvider,
  name,
  codegen,
}: {
  wrapperAbsPath: string;
  httpProvider: string;
  name?: string;
  codegen?: boolean;
}): Promise<{ uri: string }> /* $ */ {
  const tempDeployManifestFilename = `polywrap.deploy-temp.yaml`;
  const tempDeployManifestPath = path.join(
    wrapperAbsPath,
    tempDeployManifestFilename
  );

  const wrapperName = name ?? generateName();
  const postUrl = `${httpProvider}/wrappers/local/${wrapperName}`;

  await buildWrapper(wrapperAbsPath, undefined, codegen);
  const deployManifest: Omit<DeployManifest, "__type"> = {
    format: "0.2.0",
    jobs: {
      buildAndDeployWrapperToHttp: {
        steps: [
          {
            name: "httpDeploy",
            package: "http",
            uri: `fs/${wrapperAbsPath}/build`,
            config: {
              postUrl,
            },
          },
        ],
      },
    },
  };
  fs.writeFileSync(
    tempDeployManifestPath,
    yaml.stringify(deployManifest, null, 2)
  );

  // deploy Wrapper

  const {
    exitCode: deployExitCode,
    stdout: deployStdout,
    stderr: deployStderr,
  } = await runCLI({
    args: ["deploy", "--manifest-file", tempDeployManifestPath],
  });

  if (deployExitCode !== 0) {
    console.error(`polywrap exited with code: ${deployExitCode}`);
    console.log(`stderr:\n${deployStderr}`);
    console.log(`stdout:\n${deployStdout}`);
    throw Error("polywrap CLI failed");
  }

  // remove manually configured manifests
  fs.unlinkSync(tempDeployManifestPath);

  return {
    uri: postUrl,
  };
}
