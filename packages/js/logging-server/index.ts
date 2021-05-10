import { exec } from "child_process";
import { ExecException } from "node:child_process";

export const runCommand = async (
  command: string,
  quiet: boolean
): Promise<void> => {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise((resolve, reject) => {
    const callback = (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        }

        resolve();
      }
    };

    exec(command, { cwd: __dirname }, callback);
  });
};

export const up = async (quiet = false): Promise<void> => {
  await runCommand("docker-compose up -d", quiet);
};

export const down = async (quiet = false): Promise<void> => {
  await runCommand("docker-compose down", quiet);
};
