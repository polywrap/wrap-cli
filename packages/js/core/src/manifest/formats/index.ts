export * from "./web3api";
export * from "./web3api.build";

// TODO: how to make this more flexible? regex not allowed in type definitions
export type ManifestFile = "web3api.yaml" | "web3api.meta.yaml";

export interface GetManifestOptions {
  uri: Uri | string;
  manifest?: ManifestFile;
}
