import { template as schemaTemplate } from "./templates/schema.mustache";
import { addHeader } from "./templates/header.mustache";

import Mustache from "mustache";
import {
  TypeInfo,
  addFirstLast,
  toGraphQLType,
  transformTypeInfo,
  moduleCapabilities,
} from "@web3api/schema-parse";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export function renderSchema(typeInfo: TypeInfo, header: boolean): string {
  // Prepare the TypeInfo for the renderer
  typeInfo = transformTypeInfo(typeInfo, addFirstLast);
  typeInfo = transformTypeInfo(typeInfo, toGraphQLType);
  typeInfo = transformTypeInfo(typeInfo, moduleCapabilities());

  let schema = Mustache.render(schemaTemplate, {
    typeInfo,
  });

  if (header) {
    schema = addHeader(schema);
  }

  // Remove needless whitespace
  return schema.replace(/[\n]{2,}/gm, "\n\n");
}
