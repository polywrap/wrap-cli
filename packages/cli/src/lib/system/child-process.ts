import { exec, ExecException } from "child_process";

export async function runCommand(
  command: string,
  quiet = false,
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
        reject({ stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    };

    const childObj = exec(
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

    if (!quiet) {
      childObj.stdout?.on("data", (data) => {
        console.log(data.toString());
      });

      childObj.stderr?.on("data", (data) => {
        console.error(data.toString());
      });
    }
  });
}
