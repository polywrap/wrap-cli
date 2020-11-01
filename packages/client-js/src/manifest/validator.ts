import { Validator } from "jsonschema";
import { existsSync } from "fs";
import { valid } from "semver";

import schema from "@web3api/manifest-schema";

import { saveMigration, migrator } from "./migrator";
import { Manifest } from "./Manifest";

enum ValidationError {
  ADDITIONAL_PROPERTY = "additionalProperties",
  TYPE = "type",
  REQUIRED = "required",
  INPUT = "format",
}

const validator = new Validator();

Validator.prototype.customFormats.file = (file: string) => {
  return validateFile(file);
};

Validator.prototype.customFormats.version = (version: string) => {
  return validateVersion(version);
};

const validateFile = (path: string) => {
  const exists = existsSync(path);
  return exists;
};

const validateVersion = (version: string) => {
  // Valid method returns null or the version (not true or false)
  return valid(version) ? true : false;
};

export const manifestValidation = (manifest: Manifest): Manifest => {
  const ManifestSchema = schema["manifest"];

  const { errors } = validator.validate(manifest, ManifestSchema);
  /*     
   We should handle five cases or errors:
   1- When a non-accepted field is added to the manifest
   2- When the type of the field it's not expected one
   3- When a required field it's not sent
   4- When version string it's not correct
   5- When file string it's not an existing file
  */
  if (errors.length > 0) {
    let { path, message, name, argument, instance } = errors[0];

    // Property is equal to: subgraph.file or mutation.module.languange
    // Let's show a good looking mapping of properties
    const pathMapping = path.join(" -> ");

    switch (name) {
      case ValidationError.REQUIRED:
        const propertyRequired =
          path.length === 0 ? `${argument}.` : `${argument} in ${pathMapping}.`;
        throw Error(
          `Missing field: ${propertyRequired} Please add it to the manifest`
        );
      case ValidationError.ADDITIONAL_PROPERTY:
        throw Error(
          `Field ${argument} is not accepted in the schema. Please check the accepted fields here: LINK_TO_SCHEMA`
        );
      case ValidationError.TYPE:
        const property =
          path.length === 1 ? `Property ${path[0]}` : `Property ${pathMapping}`;
        throw Error(`${property} has a type error: ${message}`);
      case ValidationError.INPUT:
        const isVersionError = argument === "version";
        const nonExistantFileError = argument === "file";
        if (isVersionError) {
          throw Error(
            "Version format it's not correct. Example of an accepted format: 2.5.1"
          );
        } else if (nonExistantFileError) {
          throw Error(
            `Property ${pathMapping} has the value ${instance}, which is a file that does not exists`
          );
        }
    }
  }

  const newVersion = migrator(manifest);
  if (newVersion) {
    saveMigration(manifest.version as string, manifest);
  }

  return manifest;
};
