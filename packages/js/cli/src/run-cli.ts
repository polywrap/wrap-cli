import path from "path";
import fs from "fs";
import spawn from "spawn-command";

const monorepoCli = `${__dirname}/../../../cli/bin/polywrap`;
const npmCli = `${__dirname}/../../../polywrap/bin/polywrap`;

export interface CliConfig {
  cwd?: string;
  cli?: string;
  env?: Record<string, string>;
}

export const runCli = async (options: {
  args: string[];
  config?: CliConfig;
}): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> => {
  const config: CliConfig = options.config || {};
  const args = options.args;

  return new Promise((resolve, reject) => {
    if (!config.cwd) {
      // Make sure to set an absolute working directory
      const cwd = process.cwd();
      config.cwd = cwd[0] !== "/" ? path.resolve(__dirname, cwd) : cwd;
    }

    // Resolve the CLI
    if (!config.cli) {
      if (fs.existsSync(monorepoCli)) {
        config.cli = monorepoCli;
      } else if (fs.existsSync(npmCli)) {
        config.cli = npmCli;
      } else {
        throw Error(`runCli is missing a valid CLI path, please provide one`);
      }
    }

    let executor = "node";
    if (config.cli && config.cli.split("/").pop()?.startsWith("polywrap-")) {
      executor = "";
    }
    const command = `${executor} ${config.cli} ${args.join(" ")}`.trimStart();
    const child = spawn(command, { cwd: config.cwd, env: config.env });

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
      resolve({ exitCode, stdout, stderr });
    });
  });
};
