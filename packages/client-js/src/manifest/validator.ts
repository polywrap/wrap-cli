import { Manifest } from "./formats/0.0.1-alpha.1";
import { latestFormat } from "./formats";
import { upgradeManifest, ManifestFormats } from "./migrator";

import { Validator } from "jsonschema";
import { compare } from "semver";

const packageInformation = require("../../package.json");
const schema = require("@web3api/manifest-schema");

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

const validateFile = (path: string) => {
  const validPathMatch = path.match(/^((\.\/|..\/)[^\/ ]*)+\/?$/gm);
  return validPathMatch && validPathMatch[0].length === path.length;
};

Validator.prototype.customFormats.manifestFormat = (format: string) => {
  return validateFormat(format);
};

const validateFormat = (format: string) => {
  // TODO: accept any previous versions?
  return format === packageInformation.version;
}

export const sanitizeAndUpgrade = (manifest: Manifest): Manifest => {
  const ManifestSchema = schema["manifest"];

  const { errors } = validator.validate(manifest, ManifestSchema);
  /*
   We should handle five cases or errors:
   1- When a non-accepted field is added to the manifest
   2- When the type of the field is unknown
   3- When a required field is not sent
   4- When version string is not correct
   5- When file string is not an existing file
  */
  if (errors.length > 0) {
    let { path, message, name, argument, instance } = errors[0];
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
        const isFormatVersionError = argument === "manifestFormat";
        const isFileError = argument === "file";
        if (isFormatVersionError) {
          throw Error(
            `The manifest's format is not correct. Accepted format version: ${packageInformation.version}`
          );
        } else if (isFileError) {
          throw Error(
            `Property ${pathMapping} has the value "${instance}", which is not a valid file path.` +
            ` Please use unix style relative paths.`
          );
        } else {
          throw Error(
            `Unknown INPUT error found:` +
            `\nName: ${name}\nPath: ${pathMapping}\nMessage: ${message}\nArgument: ${argument}\nValue: ${instance}`
          );
        }
      default:
        throw Error(
          `Unknown manifest sanitization error:` +
          `\nName: ${name}\nPath: ${pathMapping}\nMessage: ${message}\nArgument: ${argument}\nValue: ${instance}`
        );
    }
  }

  if (compare(manifest.format, latestFormat) === -1) {
    manifest = upgradeManifest(manifest, latestFormat as ManifestFormats);
  }

  return manifest;
};
