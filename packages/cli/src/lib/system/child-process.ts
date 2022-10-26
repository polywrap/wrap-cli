import { Logger } from "../logging";

import {
  execFile,
  ExecException,
  execFileSync,
  SpawnSyncReturns,
} from "child_process";

export function runCommandSync(
  command: string,
  args: string[],
  logger: Logger,
  env: Record<string, string> | undefined = undefined
): { stdout?: string; stderr?: SpawnSyncReturns<string> & Error } {
  logger.info(`> ${command} ${args.join(" ")}`);

  try {
    const stdout = execFileSync(command, args, {
      cwd: __dirname,
      env: {
        ...process.env,
        ...env,
      },
      encoding: "utf-8",
    });
    return { stdout: stdout };
  } catch (e) {
    return { stderr: e };
  }
}

export async function runCommand(
  command: string,
  args: string[],
  logger: Logger,
  env: Record<string, string> | undefined = undefined,
  cwd: string | undefined = undefined,
  redirectStderr = false
): Promise<{ stdout: string; stderr: string }> {
  logger.info(`> ${command} ${args.join(" ")}`);

  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const callback = (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (err) {
        reject({ stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    };

    const childObj = execFile(
      command,
      args,
      {
        cwd: cwd ?? __dirname,
        env: {
          ...process.env,
          ...env,
        },
      },
      callback
    );

    childObj.stdout?.on("data", (data) => {
      logger.info(data.toString());
    });

    childObj.stderr?.on("data", (data) => {
      if (redirectStderr) {
        logger.info(data.toString());
      } else {
        logger.error(data.toString());
      }
    });
  });
}
