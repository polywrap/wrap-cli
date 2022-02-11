import yaml from "js-yaml";

export function getParserForFile(path: string) {
  return path.endsWith(".yaml") || path.endsWith(".yml")
    ? yaml.load
    : JSON.parse;
}
