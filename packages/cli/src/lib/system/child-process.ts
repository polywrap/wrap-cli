import { Logger } from "../logging";

import { exec, ExecException, execSync, SpawnSyncReturns } from "child_process";

export function runCommandSync(
  command: string,
  logger: Logger,
  env: Record<string, string> | undefined = undefined
): { stdout?: string; stderr?: SpawnSyncReturns<string> & Error } {

  logger.info(`> ${command}`);

  try {
    const stdout = execSync(command, {
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
  logger: Logger,
  env: Record<string, string> | undefined = undefined,
  cwd: string | undefined = undefined,
  redirectStderr: boolean = false
): Promise<{ stdout: string; stderr: string }> {
  logger.info(`> ${command}`);

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

    const childObj = exec(
      command,
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
