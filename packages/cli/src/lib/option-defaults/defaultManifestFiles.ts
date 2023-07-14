import {
  defaultAppManifest,
  defaultPluginManifest,
  defaultPolywrapManifestFiles,
} from "../project";

const filterUniqueFn = (value: string, index: number, self: Array<string>) =>
  self.indexOf(value) === index;

export const defaultProjectManifestFiles = [
  ...defaultPolywrapManifestFiles,
  ...defaultAppManifest,
  ...defaultPluginManifest,
].filter(filterUniqueFn);
