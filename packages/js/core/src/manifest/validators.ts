import { Uri } from "../types";

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

export function packageName(name: unknown): boolean {
  return typeof name === "string";
}

export function packageTag(tag: unknown): boolean {
  return typeof tag === "string";
}

export function dockerImageName(name: unknown): boolean {
  return typeof name === "string";
}

export function dockerfileName(value: unknown): boolean {
  return (
    typeof value === "string" && file(value) && value.indexOf("Dockerfile") > -1
  );
}

export function dockerImageId(value: unknown): boolean {
  return typeof value === "string" && value.indexOf("sha256:") > -1;
}

export function wasmLanguage(language: unknown): boolean {
  return (
    typeof language === "string" &&
    (language === "interface" || language.indexOf("wasm/") > -1)
  );
}

export function pluginLanguage(language: unknown): boolean {
  return typeof language === "string" && language.indexOf("plugin/") > -1;
}

export function appLanguage(language: unknown): boolean {
  return typeof language === "string" && language.indexOf("app/") > -1;
}

export function imageFile(filePath: unknown): boolean {
  return (
    typeof filePath === "string" &&
    file(filePath) &&
    !!filePath.match(/(\.svg|\.png)$/)?.length
  );
}

export function websiteUrl(url: unknown): boolean {
  function validUrl(str: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
      "i"
    );
    return !!pattern.test(str);
  }
  return typeof url === "string" && validUrl(url);
}

export function graphqlFile(filePath: unknown): boolean {
  return (
    typeof filePath === "string" &&
    file(filePath) &&
    !!filePath.match(/(\.graphql)$/)?.length
  );
}

export function jsonFile(filePath: unknown): boolean {
  return (
    typeof filePath === "string" &&
    file(filePath) &&
    !!filePath.match(/(\.json)$/)?.length
  );
}

export function yamlFile(filePath: unknown): boolean {
  return (
    typeof filePath === "string" &&
    file(filePath) &&
    !!filePath.match(/(\.yaml)$/)?.length
  );
}

export function manifestFile(filePath: unknown): boolean {
  return jsonFile(filePath) || yamlFile(filePath);
}

export function regexString(regex: unknown): boolean {
  if (typeof regex !== "string") {
    return false;
  }

  let isValid = true;
  try {
    new RegExp(regex);
  } catch (e) {
    isValid = false;
  }

  return isValid;
}

export function polywrapUri(uri: unknown): boolean {
  return typeof uri === "string" && Uri.isValidUri(uri);
}

export function schemaFile(filePath: unknown): boolean {
  return typeof filePath === "string" && file(filePath);
}

export function directory(path: unknown): boolean {
  if (typeof path === "boolean") {
    return true;
  }
  if (typeof path !== "string") {
    return false;
  }

  const validDirRegex = /^\/?[\w\-/]+$/;

  return !!validDirRegex.test(path);
}
