import {
  defaultAppManifest,
  defaultPluginManifest,
  defaultPolywrapManifest,
} from "../project";

const filterUniqueFn = (value: string, index: number, self: Array<string>) =>
  self.indexOf(value) === index;

export const defaultProjectManifestFiles = [
  ...defaultPolywrapManifest,
  ...defaultAppManifest,
  ...defaultPluginManifest,
].filter(filterUniqueFn);
