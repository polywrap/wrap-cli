/* eslint-disable @typescript-eslint/naming-convention */
import * as Functions from "../functions";
import { GenerateBindingFn, renderTemplates } from "../..";
import { BindOptions, BindOutput } from "../../..";

import {
  transformAbi,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  methodParentPointers,
  interfaceUris,
} from "@polywrap/schema-parse";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js";
import path from "path";
import { latestWrapManifestVersion } from "@polywrap/wrap-manifest-types-js";
import { msgpackEncode } from "@polywrap/msgpack-js";

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

  const manifest = {
    name: options.projectName,
    type: "plugin",
    version: latestWrapManifestVersion,
    abi: msgpackEncode(options.abi, true)
      .toString()
      .split(",")
      .map((x) => x + ".toByte()")
      .join(","),
  };

  output.entries = renderTemplates(templatePath(""), { ...abi, manifest }, {});

  return result;
};

function applyTransforms(abi: WrapAbi): WrapAbi {
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
