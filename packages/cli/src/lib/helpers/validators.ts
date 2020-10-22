import { validate, JSONSchema4 } from "json-schema";
import { compile } from "json-schema-to-typescript";
import { writeFile } from "fs";

import ManifestSchema from "./schema.json";

export const manifestValidation = (manifest: object) => {
  const { valid, errors } = validate(manifest, ManifestSchema as JSONSchema4);
  if (!valid) {
    let { property, message } = errors[0];

    // Property is equal to: subgraph.file or mutation.module.languange
    // Let's make it an array
    let propertyMapping: string[] | string = property.split(".");

    // Let's show a good looking mapping of properties for the user (If it's a nested property)
    propertyMapping = propertyMapping.join(" -> ");

    // @TODO: Improve error messages also, should we use the print from gluegun?
    const errorMessage = `Property ${propertyMapping} has the following error: ${message}`;
    throw Error(errorMessage);
  }

  compile(ManifestSchema as JSONSchema4, "Web3API").then((file) => {
    // @TODO: Make sure where do we want to generate this file
    writeFile("./Manifest.ts", file, (error: Error | null) => {
      if (error) throw Error(error.message);
      console.log("\nManifest type file created");
    });
  });
};
