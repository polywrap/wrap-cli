import { exec, ExecException } from "child_process";

export async function runCommand(
  command: string,
  quiet = false,
  env = undefined
): Promise<{ stdout: string, stderr: string }> {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise<{ stdout: string, stderr: string }>(
    (resolve, reject) => {
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

          resolve({ stdout, stderr });
        }
      };

      exec(command, { cwd: __dirname, env }, callback);
    }
  );
}
