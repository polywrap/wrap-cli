import path from "path";

export function parseCodegenScriptOption(
  script: string | undefined | false
): string | false {
  return script ? path.resolve(script) : false;
}
