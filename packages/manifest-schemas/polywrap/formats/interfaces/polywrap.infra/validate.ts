/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/validate-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/validate-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */
import {
  AnyInfraManifest,
  InfraManifestFormats
} from ".";

import schema_0_0_1_prealpha_1 from "@polywrap/polywrap-manifest-schemas/formats/schemas/polywrap.infra/0.0.1-prealpha.1.json";
import schema_0_0_1_prealpha_2 from "@polywrap/polywrap-manifest-schemas/formats/schemas/polywrap.infra/0.0.1-prealpha.2.json";
import { Tracer } from "@polywrap/tracing-js"

import {
  Schema,
  Validator,
  ValidationError,
  ValidatorResult
} from "jsonschema";

type InfraManifestSchemas = {
  [key in InfraManifestFormats]: Schema | undefined
};

const schemas: InfraManifestSchemas = {
  "0.0.1-prealpha.1": schema_0_0_1_prealpha_1,
  "0.0.1-prealpha.2": schema_0_0_1_prealpha_2,
};

const validator = new Validator();


export const validateInfraManifest = Tracer.traceFunc(
  "core: validateInfraManifest",
  (
    manifest: AnyInfraManifest,
    extSchema: Schema | undefined = undefined
  ): void => {
    const schema = schemas[manifest.format as InfraManifestFormats];

    if (!schema) {
      throw Error(`Unrecognized InfraManifest schema format "${manifest.format}"\nmanifest: ${JSON.stringify(manifest, null, 2)}`);
    }

    const throwIfErrors = (result: ValidatorResult) => {
      if (result.errors.length) {
        throw new Error([
          `Validation errors encountered while sanitizing InfraManifest format ${manifest.format}`,
          ...result.errors.map((error: ValidationError) => error.toString())
        ].join("\n"));
      }
    };

    throwIfErrors(validator.validate(manifest, schema));

    if (extSchema) {
      throwIfErrors(validator.validate(manifest, extSchema));
    }
  }
);
