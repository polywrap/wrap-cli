/* eslint-disable @typescript-eslint/naming-convention */
import path from "path";
import axios from "axios";
import fs from "fs";
import yaml from "yaml";
import * as PolywrapCli from "@polywrap/cli-js";
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
  const cliResp = await PolywrapCli.Commands.infra(
    "up", {
      modules: ["eth-ens-ipfs"],
      verbose: true
    }
  );

  const { exitCode, stdout, stderr } = cliResp;

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
  const cliResp = await PolywrapCli.Commands.infra(
    "down", {
      modules: ["eth-ens-ipfs"]
    }
  );

  const { exitCode, stderr } = cliResp;

  if (exitCode) {
    throw Error(
      `stopTestEnvironment failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}`
    );
  }

  return Promise.resolve();
};

// $start: buildWrapper
/**
 * Build the wrapper located at the given path
 *
 * @param wrapperAbsPath - absolute path of wrapper to build
 * @param manifestPathOverride? - path to polywrap manifest
 * @param noCodegen? - don't run codegen before build
 */
export async function buildWrapper(
  wrapperAbsPath: string,
  manifestPathOverride?: string,
  noCodegen?: boolean
): Promise<void> /* $ */ {
  const manifestPath = manifestPathOverride
    ? path.join(wrapperAbsPath, manifestPathOverride)
    : `${wrapperAbsPath}/polywrap.yaml`;

  const cliResp = await PolywrapCli.Commands.build({
    manifestFile: manifestPath,
    outputDir: `${wrapperAbsPath}/build`,
    noCodegen: noCodegen
  }, {
    cwd: wrapperAbsPath
  });

  if (cliResp.exitCode !== 0) {
    console.error(`polywrap exited with code: ${cliResp.exitCode}`);
    console.log(`stderr:\n${cliResp.stderr}`);
    console.log(`stdout:\n${cliResp.stdout}`);
    throw Error("polywrap CLI failed");
  }
}

// $start: deployWrapper
/**
 * Deploy the wrapper located at the given path, and then deploy it based on given jobs.
 *
 * @param options - an object containing:
 *   wrapperAbsPath - absolute path of wrapper to build
 *   jobs - jobs that will be executed in deploy process
 *   codegen? - run codegen before build
 *   build? - run build before deploy
 */
export async function deployWrapper(options: {
  wrapperAbsPath: string;
  jobs: DeployManifest["jobs"];
  codegen?: boolean;
  build?: boolean;
}): Promise<void | {
  stdout: string;
  stderr: string;
}> /* $ */ {
  const { wrapperAbsPath, jobs, codegen, build } = options;
  const tempDeployManifestFilename = `polywrap.deploy-temp.yaml`;
  const tempDeployManifestPath = path.join(
    wrapperAbsPath,
    tempDeployManifestFilename
  );

  if (build) {
    await buildWrapper(wrapperAbsPath, undefined, codegen);
  }

  const deployManifest: Omit<DeployManifest, "__type"> = {
    format: "0.2.0",
    jobs,
  };
  fs.writeFileSync(
    tempDeployManifestPath,
    yaml.stringify(deployManifest, null, 2)
  );

  // deploy Wrapper
  const cliResp = await PolywrapCli.Commands.deploy({
    manifestFile: tempDeployManifestPath
  });

  if (cliResp.exitCode !== 0) {
    console.error(`polywrap exited with code: ${cliResp.exitCode}`);
    console.log(`stderr:\n${cliResp.stderr}`);
    console.log(`stdout:\n${cliResp.stdout}`);
    throw Error("polywrap CLI failed");
  }

  // remove manually configured manifests
  fs.unlinkSync(tempDeployManifestPath);

  return {
    stdout: cliResp.stdout,
    stderr: cliResp.stderr,
  };
}
