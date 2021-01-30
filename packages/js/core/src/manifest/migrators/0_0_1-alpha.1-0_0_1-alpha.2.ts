import { Manifest as OldManifest } from "../formats/0.0.1-prealpha.1";
import { Manifest as NewManifest } from "../formats/0.0.1-prealpha.2";

export function migrate(old: OldManifest): NewManifest {
  const NEW_FORMAT = "0.0.1-prealpha.2";
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
    format: NEW_FORMAT,
    api,
  };

  return upgrade;
}
