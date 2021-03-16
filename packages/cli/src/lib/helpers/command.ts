import { exec, ExecException } from "child_process";

export async function runCommand(
  command: string,
  quiet = false
): Promise<void> {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise<void>((resolve, reject) => {
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
}
