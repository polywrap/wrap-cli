import { header } from "@polywrap/schema-parse";
import Mustache from "mustache";

// Remove mustache's built-in HTML escaping
Mustache.escape = (value) => value;

export const template = `${header}

{{schema}}
`;

export function addHeader(schema: string): string {
  return Mustache.render(template, { schema });
}
