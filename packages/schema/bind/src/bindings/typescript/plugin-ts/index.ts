/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn } from "../..";
import { renderTemplates } from "../../utils/templates";
import { BindOptions, BindOutput } from "../../..";

import {
  Abi,
  transformAbi,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  interfaceUris,
} from "@polywrap/schema-parse";
import path from "path";

export { Functions };

const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  // Apply Abi transforms
  const abi = applyTransforms(options.abi);

  // Generate Bindings
  const result: BindOutput = {
    output: {
      entries: [],
    },
    outputDirAbs: options.outputDirAbs,
  };
  const output = result.output;

  const wrapManifest = {
    name: options.projectName,
    type: "plugin",
    version: "0.1",
    abi: JSON.stringify(options.abi, null, 2),
  };
  output.entries = renderTemplates(
    templatePath(""),
    { ...abi, wrapManifest },
    {}
  );

  return result;
};

function applyTransforms(abi: Abi): Abi {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    methodParentPointers(),
    interfaceUris(),
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }
  return abi;
}
