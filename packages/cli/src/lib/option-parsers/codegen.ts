import path from "path";

const defaultCodegenDir = "./wrap";

export function parseCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultCodegenDir);
}

export function defaultCodegenDirOption(): string {
  return parseCodegenDirOption(undefined, undefined);
}

export function parseCodegenScriptOption(
  script: string | undefined,
  _: unknown
): string | undefined {
  return script ? path.resolve(script) : undefined;
}

export function defaultCodegenScriptOption(): string | undefined {
  return parseCodegenScriptOption(undefined, undefined);
}
