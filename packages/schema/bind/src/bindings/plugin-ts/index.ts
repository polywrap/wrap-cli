/* eslint-disable @typescript-eslint/naming-convention */
import { OutputDirectory, OutputEntry, readDirectory } from "../..";
import { createPluginContext } from "../../utils/createPluginContext";
import * as Functions from "./functions";

import { Manifest, MetaManifest } from "@web3api/core-js";
import {
  addFirstLast,
  extendType,
  ImportedQueryDefinition,
  interfaceUris,
  InvokableModules,
  methodParentPointers,
  QueryDefinition,
  toPrefixedGraphQLType,
  transformTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";
import { readFileSync } from "fs";
import Mustache from "mustache";
import path from "path";

export function generateEntrypointBinding(
  typeInfo: TypeInfo,
  schema: string,
  manifest: Manifest,
  metaManifest?: MetaManifest
): OutputDirectory {
  const entries: OutputEntry[] = [];

  renderTemplate("./templates/entrypoint/index-ts.mustache", {}, entries);
  renderTemplate("./templates/entrypoint/manifest-ts.mustache", {}, entries);
  renderTemplate(
    "./templates/entrypoint/schema-ts.mustache",
    { schema },
    entries
  );
  renderTemplate(
    "./templates/entrypoint/plugin-ts.mustache",
    createPluginContext({ typeInfo, manifest, metaManifest }),
    entries
  );

  return { entries };
}

export function generateBinding(typeInfo: TypeInfo): OutputDirectory {
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

  const queryContext = typeInfo.queryTypes.find((def: QueryDefinition) => {
    return def.type === "Query";
  });
  const mutationContext = typeInfo.queryTypes.find((def: QueryDefinition) => {
    return def.type === "Mutation";
  });

  const rootContext = {
    ...typeInfo,
    __mutation: !!mutationContext,
    __query: !!queryContext,
  };

  if (queryContext) {
    entries.push(
      ...generateFiles("./templates/query-type", rootContext, "query")
    );
  } else if (mutationContext) {
    entries.push(
      ...generateFiles("./templates/query-type", rootContext, "mutation")
    );
  }

  return { entries };
}

function generateFiles(
  subpath: string,
  rootContext: TypeInfo,
  module: InvokableModules | null = null,
  subDirectories = false
): OutputEntry[] {
  const output: OutputEntry[] = [];
  const absolutePath = path.join(__dirname, subpath);
  const directory = readDirectory(absolutePath);

  const processDirectory = (
    entries: OutputEntry[],
    output: OutputEntry[],
    module: InvokableModules | null
  ) => {
    for (const dirent of entries) {
      if (dirent.type === "File") {
        let name = path.parse(dirent.name).name;

        // file templates don't contain '_'
        if (name.indexOf("_") === -1) {
          let data: string | undefined;

          if (module && ["index-ts", "query-ts"].includes(name)) {
            name = name === "query-ts" ? `${module}-ts` : name;

            const context = module
              ? rootContext.queryTypes.find((def: QueryDefinition) => {
                  return def.type.toLowerCase() === module;
                })
              : rootContext;
            const hasEnv = rootContext.envTypes[module].sanitized
              ? true
              : false;
            data = Mustache.render(dirent.data, {
              ...context,
              __hasEnv: hasEnv,
            });
          }

          if (module && name === "types-ts.mustache") {
            const context = {
              ...rootContext,
              importedQueryTypes: rootContext.importedQueryTypes.filter(
                (def: ImportedQueryDefinition) => def.nativeType === module
              ),
            };
            data = Mustache.render(dirent.data, context);
          }

          if (!data) {
            data = Mustache.render(dirent.data, rootContext);
          }

          // If the file isn't empty, add it to the output
          if (data) {
            output.push({
              type: "File",
              name: name.replace("-", "."),
              data,
            });
          }
        }
      } else if (dirent.type === "Directory" && subDirectories) {
        const subOutput: OutputEntry[] = [];

        processDirectory(dirent.data as OutputEntry[], subOutput, module);

        output.push({
          type: "Directory",
          name: dirent.name,
          data: subOutput,
        });
      }
    }
  };

  processDirectory(directory.entries, output, module);

  return output;
}

const renderTemplate = (
  subPath: string,
  context: Record<string, unknown>,
  output: OutputEntry[]
) => {
  const absPath = path.join(__dirname, subPath);
  const template = readFileSync(absPath, { encoding: "utf-8" });
  const fileName = absPath
    .replace(path.dirname(absPath), "")
    .replace(".mustache", "")
    .replace("/", "")
    .replace("\\", "")
    .replace("-", ".");

  output.push({
    type: "File",
    name: fileName,
    data: Mustache.render(template, { ...context, ...Functions }),
  });
};
