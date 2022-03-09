/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn } from "../..";
import { OutputDirectory } from "../../..";

import {
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  TypeInfo,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import { readFileSync } from "fs";
import path from "path";

export { Functions };

export const generateBinding: GenerateBindingFn = (
  output: OutputDirectory,
  typeInfo: TypeInfo,
  schema: string,
  _config: Record<string, unknown>
): void => {
  // Transform the TypeInfo to our liking
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }

  const renderTemplate = (
    subPath: string,
    context: unknown,
    fileName?: string
  ) => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });
    fileName =
      fileName ||
      absPath
        .replace(path.dirname(absPath), "")
        .replace(".mustache", "")
        .replace("/", "")
        .replace("\\", "")
        .replace("-", ".");

    output.entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  const rootContext = {
    ...typeInfo,
    schema,
  };

  renderTemplate("./templates/index-ts.mustache", rootContext);
  renderTemplate("./templates/schema-ts.mustache", rootContext);
  renderTemplate("./templates/types-ts.mustache", rootContext);
};
