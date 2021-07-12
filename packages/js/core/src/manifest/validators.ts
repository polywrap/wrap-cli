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
  if (typeof name !== "string") {
    return false;
  }

  return true;
}

export function dockerfileName(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (file(value) && value.indexOf("Dockerfile") > -1) {
    return true;
  }

  return true;
}

export function dockerImageId(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (value.indexOf("sha256:") === -1) {
    return false;
  }

  return true;
}

export function wasmLanguage(language: unknown): boolean {
  if (typeof language !== "string") {
    return false;
  }

  if (language.indexOf("wasm/") > -1) {
    return true;
  }

  return false;
}
