import { generateName } from "./generate-name";

import path from "path";
import spawn from "spawn-command";
import axios from "axios";
import fs from "fs";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  registrarAddress: string;
  reverseAddress: string;
  resolverAddress: string;
}

const monorepoCli = `${__dirname}/../../../cli/bin/w3`;
const npmCli = `${__dirname}/../../cli/bin/w3`;

export const initTestEnvironment = async (
  cli?: string
): Promise<TestEnvironment> => {
  // Start the test environment
  const { exitCode, stderr, stdout } = await runCLI({
    args: ["test-env", "up"],
    cli,
  });

  if (exitCode) {
    throw Error(
      `initTestEnvironment failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  try {
    // fetch providers from dev server
    const { data: providers } = await axios.get(
      "http://localhost:4040/providers"
    );

    const ipfs = providers.ipfs;
    const ethereum = providers.ethereum;

    // re-deploy ENS
    const { data: ensAddresses } = await axios.get(
      "http://localhost:4040/deploy-ens"
    );
    return {
      ipfs,
      ethereum,
      ...ensAddresses,
    };
  } catch (e) {
    throw Error(`Dev server must be running at port 4040\n${e}`);
  }
};

export const stopTestEnvironment = async (cli?: string): Promise<void> => {
  // Stop the test environment
  const { exitCode, stderr } = await runCLI({
    args: ["test-env", "down"],
    cli,
  });

  if (exitCode) {
    throw Error(
      `stopTestEnvironment failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}`
    );
  }

  return Promise.resolve();
};

export const runCLI = async (options: {
  args: string[];
  cwd?: string;
  cli?: string;
}): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> => {
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
    const child = spawn(command, { cwd: options.cwd });

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

export async function buildAndDeployApi(
  apiAbsPath: string,
  ipfsProvider: string,
  ensAddress: string
): Promise<{
  ensDomain: string;
  ipfsCid: string;
}> {
  // create a new ENS domain
  const apiEns = `${generateName()}.eth`;

  // build & deploy the protocol
  const { exitCode, stdout, stderr } = await runCLI({
    args: [
      "build",
      "--manifest-file",
      `${apiAbsPath}/web3api.yaml`,
      "--output-dir",
      `${apiAbsPath}/build`,
      "--ipfs",
      ipfsProvider,
      "--test-ens",
      `${ensAddress},${apiEns}`,
    ],
  });

  if (exitCode !== 0) {
    console.error(`w3 exited with code: ${exitCode}`);
    console.log(`stderr:\n${stderr}`);
    console.log(`stdout:\n${stdout}`);
    throw Error("w3 CLI failed");
  }

  // get the IPFS CID of the published package
  const extractCID = /IPFS { (([A-Z]|[a-z]|[0-9])*) }/;
  const result = stdout.match(extractCID);

  if (!result) {
    throw Error(`W3 CLI output missing IPFS CID.\nOutput: ${stdout}`);
  }

  const apiCid = result[1];

  return {
    ensDomain: apiEns,
    ipfsCid: apiCid,
  };
}
