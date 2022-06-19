import { GenerateBindingFn } from "../..";
import { BindOptions, BindOutput } from "../../..";
import * as Functions from "./../functions";
import * as TypeScriptFunctions from "./../../typescript/functions";
import { createNamespaceSections } from "./namespaceSections";
import { generateDocusaurusBindings } from "../docusaurus";

import {
  TypeInfo,
  transformTypeInfo,
  addFirstLast,
  toPrefixedGraphQLType,
  extendType,
  methodParentPointers,
} from "@polywrap/schema-parse";
import Mustache from "mustache";
import path from "path";
import { readFileSync } from "fs";

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const typeInfo = applyTransforms(options.typeInfo);
  const result: BindOutput = generateDocusaurusBindings(options, typeInfo);
  const output = result.output;

  const renderTemplate = (
    subPath: string,
    context: unknown,
    fileName: string
  ) => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });

    output.entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  // generate sidebar.js
  const sidebarContext = createNamespaceSections(typeInfo);
  renderTemplate(
    "./templates/sidebars-js.mustache",
    sidebarContext,
    `../../sidebars.js`
  );

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [
    extendType(Functions),
    extendType(TypeScriptFunctions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
  ];

  for (const transform of transforms) {
    typeInfo = transformTypeInfo(typeInfo, transform);
  }
  return typeInfo;
}
