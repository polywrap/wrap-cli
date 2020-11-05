import { Manifest as OldManifest } from "../versions/0.0.1-alpha.1";
import { Manifest as NewManifest } from "../versions/0.0.1-alpha.2";

export function migrate(old: OldManifest): NewManifest {
  const NEW_VERSION = "0.0.1-alpha.2";
  const schemas = [];
  let api = {};

  if (old.query) {
    schemas.push(old.query.schema.file);
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
    schemas.push(old.mutation.schema.file);
    if (old.mutation.module) {
      api = {
        ...api,
        mutation: {
          file: old.query.module.file,
          language: old.query.module.language,
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
    version: NEW_VERSION,
    api,
  };

  return upgrade;
}
