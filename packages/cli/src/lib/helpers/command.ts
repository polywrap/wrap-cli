import { exec, ExecException } from "child_process";

export async function runCommand(
  command: string,
  quiet = true,
  env: Record<string, string> | undefined = undefined
): Promise<{ stdout: string; stderr: string }> {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const callback = (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (err) {
        console.error(stdout);
        console.error(stderr);
        reject(err);
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(stdout);
          console.error(stderr);
        }

        resolve({ stdout, stderr });
      }
    };

    exec(
      command,
      {
        cwd: __dirname,
        env: {
          ...process.env,
          ...env,
        },
      },
      callback
    );
  });
}
