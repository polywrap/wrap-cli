import {
  AnyBuildManifest,
  BuildManifestFormats
} from ".";
import * as Validators from "../../validators";

import schema_0_0_1_prealpha_2 from "@web3api/manifest-schemas/formats/web3api.build/0.0.1-prealpha.2.json";
import { Tracer } from "@web3api/tracing-js"

import { Validator, Schema, ValidationError } from "jsonschema";

type BuildManifestSchemas = {
  [key in BuildManifestFormats]: Schema | undefined
};

const schemas: BuildManifestSchemas = {
  "0.0.1-prealpha.2": schema_0_0_1_prealpha_2,
};

const validator = new Validator();

Validator.prototype.customFormats.dockerImageName = Validators.dockerImageName;
Validator.prototype.customFormats.imageOrDockerfile = Validators.imageOrDockerfile;

export const validateBuildManifest = Tracer.traceFunc(
  "core: validateBuildManifest",
  (manifest: AnyBuildManifest): void => {
    const schema = schemas[manifest.format as BuildManifestFormats];

    if (!schema) {
      throw Error(`Unrecognized BuildManifest schema format "${manifest.format}"`);
    }

    const result = validator.validate(manifest, schema);

    if (result.errors.length) {
      throw [
        new Error(`Validation errors encountered while sanitizing BuildManifest format ${manifest.format}`),
        ...result.errors.map((error: ValidationError) => new Error(error.toString()))
      ];
    }
  }
);
