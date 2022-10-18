import path from "path";
import spawn from "spawn-command";
import fs from "fs";

export * from "./test-environment";
export * from "./build-and-deploy";
export * from "./cli-api";

export const ensAddresses = {
  ensAddress: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  resolverAddress: "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  registrarAddress: "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
  reverseAddress: "0xe982E462b094850F12AF94d21D470e21bE9D0E9C",
} as const;

export const providers = {
  ipfs: "http://localhost:5001",
  ethereum: "http://localhost:8545",
  http: "http://localhost:3500",
};

export const embeddedWrappers = {
  ens: `wrap://fs/${path.join(__dirname, "wrappers", "ens")}`,
  uts46: `wrap://fs/${path.join(__dirname, "wrappers", "uts46")}`,
  sha3: `wrap://fs/${path.join(__dirname, "wrappers", "sha3")}`,
};

const monorepoCli = `${__dirname}/../../../cli/bin/polywrap`;
const npmCli = `${__dirname}/../../../polywrap/bin/polywrap`;

export const runCLI = async (options: {
  args: string[];
  cwd?: string;
  cli?: string;
  env?: Record<string, string>;
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
