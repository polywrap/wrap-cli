import { Manifest as OldManifest } from "../versions/0.0.1-alpha.1";
import { Manifest as NewManifest } from "../versions/0.0.1-alpha.2";

export function migrate(old: OldManifest): NewManifest {
  const NEW_VERSION = "0.0.1-alpha.2";
  const schemas = [];
  let api = {};
  let information = {};

  if (old.description) {
    information = {
      description: old.description,
    };
  }

  if (old.repository) {
    information = {
      repository: old.repository,
    };
  }

  if (old.query) {
    schemas.push({ file: old.query.schema.file });
    if (old.query.module) {
      api = {
        query: {
          file: old.query.module.file,
          language: old.query.module.language,
        },
      };
    }
  }

  if (old.mutation) {
    schemas.push({ file: old.mutation.schema.file });
    if (old.mutation.module) {
      api = {
        ...api,
        mutation: {
          file: old.mutation.module.file,
          language: old.mutation.module.language,
        },
      };
    }
  }

  if (schemas.length > 0) {
    api = {
      schemas,
      ...api,
    };
  }

  const upgrade: NewManifest = {
    ...information,
    version: NEW_VERSION,
    api,
  };

  return upgrade;
}
