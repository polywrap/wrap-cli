/* eslint-disable @typescript-eslint/naming-convention */
import { OutputDirectory, OutputEntry } from "../..";
import * as Functions from "./functions";

import {
  transformTypeInfo,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  interfaceUris,
  TypeInfo,
  QueryDefinition,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import { readFileSync } from "fs";
import path from "path";

export function generateBinding(
  typeInfo: TypeInfo,
  schema?: string
): OutputDirectory {
  const entries: OutputEntry[] = [];

  // Transform the TypeInfo to our liking
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
    interfaceUris(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }

  const renderTemplate = (subPath: string, context: unknown) => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });
    const fileName = absPath
      .replace(path.dirname(absPath), "")
      .replace(".mustache", "")
      .replace("/", "")
      .replace("\\", "")
      .replace("-", ".");

    entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  const queryContext = typeInfo.queryTypes.find((def: QueryDefinition) => {
    return def.type === "Query";
  });
  const mutationContext = typeInfo.queryTypes.find((def: QueryDefinition) => {
    return def.type === "Mutation";
  });

  const rootContext = {
    ...typeInfo,
    schema,
    __mutation: !!mutationContext,
    __query: !!queryContext,
  };

  renderTemplate("./templates/index-ts.mustache", rootContext);
  renderTemplate("./templates/manifest-ts.mustache", rootContext);
  if (mutationContext) {
    renderTemplate("./templates/mutation-ts.mustache", mutationContext);
  }
  if (queryContext) {
    renderTemplate("./templates/query-ts.mustache", queryContext);
  }
  renderTemplate("./templates/schema-ts.mustache", rootContext);
  renderTemplate("./templates/types-ts.mustache", rootContext);

  return { entries };
}
