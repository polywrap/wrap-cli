import * as Transforms from "../transforms";
import { Functions } from "../";
import { GenerateBindingFn, renderTemplates } from "../..";
import { BindOptions, BindOutput } from "../../..";

import {
  transformAbi,
  extendType,
  addFirstLast,
  toPrefixedGraphQLType,
  hasImports,
  methodParentPointers,
  latestWrapManifestVersion,
} from "@polywrap/schema-parse";
import path from "path";
import { WrapAbi } from "@polywrap/wrap-manifest-types-js/src";

const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

const sort = (obj: Record<string, unknown>) =>
  Object.keys(obj)
    .sort()
    .reduce((map: Record<string, unknown>, key: string) => {
      if (typeof obj[key] === "object") {
        map[key] = sort(obj[key] as Record<string, unknown>);

        if (Array.isArray(obj[key])) {
          map[key] = Object.values(map[key] as Record<string, unknown>);
        }
      } else {
        map[key] = obj[key];
      }
      return map;
    }, {});

export const generateBinding: GenerateBindingFn = (
  options: BindOptions
): BindOutput => {
  const result: BindOutput = {
    output: {
      entries: [],
    },
    outputDirAbs: options.outputDirAbs,
  };
  const output = result.output;
  const abi = applyTransforms(options.abi);

  const manifest = {
    name: options.projectName,
    type: "plugin",
    version: latestWrapManifestVersion,
    abi: JSON.stringify(
      sort((options.abi as unknown) as Record<string, unknown>),
      null,
      2
    ),
  };

  output.entries = renderTemplates(templatePath(""), { ...abi, manifest }, {});

  return result;
};

function applyTransforms(abi: WrapAbi): WrapAbi {
  const transforms = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
    hasImports,
    methodParentPointers(),
    Transforms.propertyDeps(),
    Transforms.byRef(),
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }
  return abi;
}
