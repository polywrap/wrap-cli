import path from "path";

export function parseCodegenScriptOption(
  script: string | undefined
): string | undefined {
  return script ? path.resolve(script) : undefined;
}
