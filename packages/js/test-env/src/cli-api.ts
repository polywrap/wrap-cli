import { runCLI } from "./index";
import { awaitPing } from "./utils";

type InfraCommandOptions = {
  infraManifest?: string;
  modules?: string[];
  verbose?: boolean;
  quiet?: boolean;
};

type CodegenCommandOptions = {
  projectManifest?: string;
  codegenDir?: string;
  publishDir?: string;
  clientConfig?: string;
  verbose?: boolean;
  quiet?: boolean;
};

type BuildCommandOptions = {
  projectManifest?: string;
  outputDir?: string;
  clientConfig?: string;
  noCodegen?: boolean;
  strategy?: "vm" | "image" | "local";
  verbose?: boolean;
  quiet?: boolean;
};

type DeployCommandOptions = {
  projectManifest?: string;
  outputFile?: string;
  verbose?: boolean;
  quiet?: boolean;
};

/**
 * Initialize test environment declared in infra manifest
 *
 * @param awaitResponseUris: an array of URI's from which to await responses
 * @param options: options for Polywrap CLI 'infra' command
 * @param cwd: the current working directory for the CLI call
 * */
export async function infraUp(
  awaitResponseUris?: string[],
  options?: InfraCommandOptions,
  cwd?: string
): Promise<void> {
  const modules = options?.modules ? ["--modules", ...options.modules] : [];
  const manifest = options?.infraManifest
    ? ["--manifest-file", options.infraManifest]
    : [];

  const { exitCode, stderr, stdout } = await runCLI({
    args: [
      "infra",
      "up",
      ...manifest,
      ...modules,
      `--verbose ${!!options?.verbose}`,
      `--quiet ${!!options?.quiet}`,
    ],
    cwd,
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  for (const uri of awaitResponseUris ?? []) {
    const success = await awaitPing(uri, 2000, 20000);

    if (!success) {
      throw Error(`test-env: resource located at ${uri} failed to start`);
    }
  }

  return Promise.resolve();
}

/**
 * Stop test environment declared in infra manifest
 *
 * @param options: options for Polywrap CLI 'infra' command
 * @param cwd: the current working directory for the CLI call
 * */
export async function infraDown(
  options?: InfraCommandOptions,
  cwd?: string
): Promise<void> {
  const modules = options?.modules ? ["--modules", ...options.modules] : [];
  const manifest = options?.infraManifest
    ? ["--manifest-file", options.infraManifest]
    : [];

  const { exitCode, stderr, stdout } = await runCLI({
    args: [
      "infra",
      "down",
      ...manifest,
      ...modules,
      `--verbose ${!!options?.verbose}`,
      `--quiet ${!!options?.quiet}`,
    ],
    cwd,
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  return Promise.resolve();
}

/**
 * Generate code for a Polywrap project
 *
 * @param wrapperAbsPath: absolute path of the wrapper root folder, used as the cwd
 * @param options: options for Polywrap CLI 'codegen' command
 * */
export async function codegen(
  wrapperAbsPath: string,
  options?: CodegenCommandOptions
): Promise<void> {
  const manifestFile = options?.projectManifest
    ? ["--manifest-file", options.projectManifest]
    : [];

  const codegenDir = options?.codegenDir
    ? ["--codegen-dir", options.codegenDir]
    : [];

  const publishDir = options?.publishDir
    ? ["--output-dir", options.publishDir]
    : [];

  const clientConfig = options?.clientConfig
    ? ["--client-config", options.clientConfig]
    : [];

  const {
    exitCode: buildExitCode,
    stdout: buildStdout,
    stderr: buildStderr,
  } = await runCLI({
    args: [
      "build",
      ...manifestFile,
      ...codegenDir,
      ...publishDir,
      ...clientConfig,
      `--verbose ${!!options?.verbose}`,
      `--quiet ${!!options?.quiet}`,
    ],
    cwd: wrapperAbsPath,
  });

  if (buildExitCode !== 0) {
    console.error(`polywrap exited with code: ${buildExitCode}`);
    console.log(`stderr:\n${buildStderr}`);
    console.log(`stdout:\n${buildStdout}`);
    throw Error("polywrap CLI failed");
  }
}

/**
 * Build a wrapper
 *
 * @param wrapperAbsPath: absolute path of the wrapper root folder, used as the cwd
 * @param options: options for Polywrap CLI 'build' command
 * */
export async function build(
  wrapperAbsPath: string,
  options?: BuildCommandOptions
): Promise<void> {
  const manifestFile = options?.projectManifest
    ? ["--manifest-file", options.projectManifest]
    : [];

  const outputDir = options?.outputDir
    ? ["--output-dir", options.outputDir]
    : [];

  const strategy = options?.strategy ? ["--strategy", options.strategy] : [];

  const clientConfig = options?.clientConfig
    ? ["--client-config", options.clientConfig]
    : [];

  const {
    exitCode: buildExitCode,
    stdout: buildStdout,
    stderr: buildStderr,
  } = await runCLI({
    args: [
      "build",
      ...manifestFile,
      ...outputDir,
      ...strategy,
      ...clientConfig,
      `--no-codegen ${!!options?.noCodegen}`,
      `--verbose ${!!options?.verbose}`,
      `--quiet ${!!options?.quiet}`,
    ],
    cwd: wrapperAbsPath,
  });

  if (buildExitCode !== 0) {
    console.error(`polywrap exited with code: ${buildExitCode}`);
    console.log(`stderr:\n${buildStderr}`);
    console.log(`stdout:\n${buildStdout}`);
    throw Error("polywrap CLI failed");
  }
}

/**
 * Deploy a wrapper using a deploy manifest
 *
 * @param wrapperAbsPath: absolute path of the wrapper root folder, used as the cwd
 * @param options: options for Polywrap CLI 'deploy' command
 * */
export async function deploy(
  wrapperAbsPath: string,
  options?: DeployCommandOptions
): Promise<void> {
  const manifestFile = options?.projectManifest
    ? ["--manifest-file", options.projectManifest]
    : [];

  const outputArgs = options?.outputFile
    ? ["--output-file", options.outputFile]
    : [];

  const {
    exitCode: buildExitCode,
    stdout: buildStdout,
    stderr: buildStderr,
  } = await runCLI({
    args: [
      "deploy",
      ...manifestFile,
      ...outputArgs,
      `--verbose ${!!options?.verbose}`,
      `--quiet ${!!options?.quiet}`,
    ],
    cwd: wrapperAbsPath,
  });

  if (buildExitCode !== 0) {
    console.error(`polywrap exited with code: ${buildExitCode}`);
    console.log(`stderr:\n${buildStderr}`);
    console.log(`stdout:\n${buildStdout}`);
    throw Error("polywrap CLI failed");
  }
}
