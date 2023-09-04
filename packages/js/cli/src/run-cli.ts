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

    const exec = isNodeScript(config.cli) ? "node" : "";
    const command = `${exec} ${config.cli} ${args.join(" ")}`.trimStart();
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

function isNodeScript(filePath: string): boolean {
  let fd: number | undefined;
  try {
    fd = fs.openSync(filePath, "r");
    const buffer = Buffer.alloc(20);
    fs.readSync(fd, buffer, 0, 20, 0);
    const header = buffer.toString("utf-8", 0, 20);
    return (
      header.startsWith("#!/usr/bin/env node") ||
      header.startsWith("#!/usr/bin/node")
    );
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err}`);
    return false;
  } finally {
    if (fd !== undefined) {
      fs.closeSync(fd);
    }
  }
}
