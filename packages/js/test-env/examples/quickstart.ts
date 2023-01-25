import {
  buildWrapper,
  initTestEnvironment,
  runCLI,
  stopTestEnvironment,
} from "../build";

import path from "path";

export async function init(): Promise<void> {
  // $start: quickstart-init
  await initTestEnvironment();
  // $end
}

export async function stop(): Promise<void> {
  // $start: quickstart-stop
  await stopTestEnvironment();
  // $end
}

export async function build(): Promise<string> {
  // $start: quickstart-build
  // get path to the wrapper in testing
  const wrapperPath: string = path.join(path.resolve(__dirname), "..");

  // build current wrapper with CLI, invoking codegen before build
  await buildWrapper(wrapperPath, undefined, true);

  // get URI to the local wrapper build
  const wrapperUri = `wrap://fs/${wrapperPath}/build`;
  // $end

  return wrapperUri;
}

export async function cli(): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  // $start: quickstart-runCLI
  const { exitCode, stderr, stdout } = await runCLI({
    args: ["infra", "up", "--verbose"],
  });
  // $end

  return { exitCode, stderr, stdout };
}
