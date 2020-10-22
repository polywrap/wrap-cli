import { validate, JSONSchema4 } from "json-schema";
import { compile } from "json-schema-to-typescript";
import { writeFile } from "fs";

import ManifestSchema from "./schema.json";

export const manifestValidation = (manifest: object) => {
  const { valid, errors } = validate(manifest, ManifestSchema as JSONSchema4);
  if (!valid) {
    let { property, message } = errors[0];

    /*     
     We should handle three cases or errors:
     1- When a non-accepted field is added to the manifest
     2- When the type of the field it's not expected one
     3- When a required field it's not sent
    */

    // First case
    const objectNotDefined = /is not defined in the schema/.test(message);
    if (objectNotDefined) {
      const unacceptedVariable = message.match(
        new RegExp("The property (.*) is not defined")
      );
      throw Error(
        `Field ${
          unacceptedVariable![1]
        } is not accepted in the schema. Please check the accepted fields here: LINK_TO_SCHEMA`
      );
    }
    // Property is equal to: subgraph.file or mutation.module.languange
    // Let's make it an array
    let propertyMapping: string[] | string = property.split(".");

    // Let's show a good looking mapping of properties for the user (If it's a nested property)
    propertyMapping = propertyMapping.join(" -> ");

    // Second case
    const wrongType = /value found, but (.*) is required/.test(message);
    if (wrongType) {
      throw Error(`Property ${propertyMapping} has a type error: ${message}`);
    }

    // Third case
    const missingKey = /is missing and it is required/.test(message);
    if (missingKey) {
      throw Error(`Missing field: ${propertyMapping}. Please add it to the manifest`);
    }
  }

  compile(ManifestSchema as JSONSchema4, "Web3API").then((file) => {
    // @TODO: Make sure where do we want to generate this file
    writeFile("./Manifest.ts", file, (error: Error | null) => {
      if (error) throw Error(error.message);
      console.log("\nManifest type file created");
    });
  });
};
