import {
  AnyWeb3ApiManifest,
  Web3ApiManifestFormats
} from ".";
import * as Validators from "../../validators";

import schema_0_0_1_prealpha_1 from "@web3api/manifest-schemas/formats/web3api/0.0.1-prealpha.1.json";
import schema_0_0_1_prealpha_2 from "@web3api/manifest-schemas/formats/web3api/0.0.1-prealpha.2.json";
import { Tracer } from "@web3api/tracing-js"

import { Validator, Schema, ValidationError } from "jsonschema";

type Web3ApiManifestSchemas = {
  [key in Web3ApiManifestFormats]: Schema | undefined
};

const schemas: Web3ApiManifestSchemas = {
  "0.0.1-prealpha.1": schema_0_0_1_prealpha_1,
  "0.0.1-prealpha.2": schema_0_0_1_prealpha_2,
};

const validator = new Validator();

Validator.prototype.customFormats.file = Validators.file;
Validator.prototype.customFormats.wasmLanguage = Validators.wasmLanguage;

export const validateWeb3ApiManifest = Tracer.traceFunc(
  "core: validateWeb3ApiManifest",
  (manifest: AnyWeb3ApiManifest): void => {
    const schema = schemas[manifest.format as Web3ApiManifestFormats];

    if (!schema) {
      throw Error(`Unrecognized Web3ApiManifest schema format "${manifest.format}"`);
    }

    const result = validator.validate(manifest, schema);

    if (result.errors.length) {
      throw [
        new Error(`Validation errors encountered while sanitizing Web3ApiManifest format ${manifest.format}`),
        ...result.errors.map((error: ValidationError) => new Error(error.toString()))
      ];
    }
  }
);
