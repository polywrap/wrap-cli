import YAML from "js-yaml";

// TODO: replace w/ Cesar's work in master branch
export interface Manifest {
  format: string;
  description?: string;
  repository?: string;
  query?: {
    schema: {
      file: string;
    };
    module: {
      file: string;
      language: string;
    };
  };
  mutation?: {
    schema: {
      file: string;
    };
    module: {
      file: string;
      language: string;
    };
  };
  import_redirects?: {
    uri: string;
    schema: string;
  }[];
}

// TODO: replace w/ Cesar's work
export function deserializeManifest(manifest: string): Manifest {
  return YAML.safeLoad(manifest) as Manifest;
}
