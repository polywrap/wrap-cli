export function file(path: unknown): boolean {
  if (typeof path !== "string") {
    return false;
  }

  // eslint-disable-next-line no-useless-escape
  const validPathMatch = path.match(/^((\.\/|..\/)[^\/ ]*)+\/?$/gm);

  let result = false;
  if (validPathMatch && validPathMatch[0]) {
    result = validPathMatch[0].length === path.length;
  }

  return result;
}

export function dockerImageName(name: unknown): boolean {
  return typeof name === "string";
}

export function dockerfileName(value: unknown): boolean {
  return typeof value === "string" && file(value) && value.indexOf("Dockerfile") > -1;
}

export function dockerImageId(value: unknown): boolean {
  return typeof value === "string" && value.indexOf("sha256:") > -1;
}

export function wasmLanguage(language: unknown): boolean {
  return typeof language === "string" && language.indexOf("wasm/") > -1;
}

export function pluginLanguage(language: unknown): boolean {
  return typeof language === "string" && language.indexOf("plugin/") > -1;
}
