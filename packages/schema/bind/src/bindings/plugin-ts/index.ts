/* eslint-disable @typescript-eslint/naming-convention */
import { OutputDirectory, OutputEntry, readDirectory } from "../..";
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
  InvokableModules,
  ImportedQueryDefinition,
} from "@web3api/schema-parse";
import Mustache from "mustache";
import path from "path";
// import { fromReservedWord } from "../../utils/templateFunctions";

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

  // const renderTemplate = (subPath: string, context: unknown) => {
  //   const absPath = path.join(__dirname, subPath);
  //   const template = readFileSync(absPath, { encoding: "utf-8" });
  //   const fileName = absPath
  //     .replace(path.dirname(absPath), "")
  //     .replace(".mustache", "")
  //     .replace("/", "")
  //     .replace("\\", "")
  //     .replace("-", ".");

  //   entries.push({
  //     type: "File",
  //     name: fileName,
  //     data: Mustache.render(template, context),
  //   });
  // };

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

  if (queryContext) {
    entries.push({
      type: "Directory",
      name: "query",
      data: generateFiles("./templates/query-type", rootContext, "query"),
    });
  } else if (mutationContext) {
    entries.push({
      type: "Directory",
      name: "mutation",
      data: generateFiles("./templates/query-type", rootContext, "mutation"),
    });
  }

  // renderTemplate("./templates/query-type/types-ts.mustache", rootContext);
  // renderTemplate("./templates/query-type/query-ts.mustache", queryContext);

  // renderTemplate("./templates/index-ts.mustache", rootContext);
  // renderTemplate("./templates/manifest-ts.mustache", rootContext);
  // if (mutationContext) {
  //   renderTemplate("./templates/query-type/query-ts.mustache", mutationContext);
  //   renderTemplate("./templates/query-type/index-ts.mustache", mutationContext);
  // }
  // if (queryContext) {
  //   renderTemplate("./templates/query-type/query-ts.mustache", queryContext);
  //   renderTemplate("./templates/query-type/index-ts.mustache", queryContext);
  // }
  // renderTemplate("./templates/schema-ts.mustache", rootContext);
  // renderTemplate("./templates/types-ts.mustache", rootContext);

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

          if (module && name === "query-ts.mustache") {
            name = `${module}-ts`;
          }
          if (
            module &&
            ["index-ts.mustache", "query-ts.mustache"].includes(name)
          ) {
            const context = module
              ? rootContext.queryTypes.find((def: QueryDefinition) => {
                  return def.type.toLowerCase() === module;
                })
              : rootContext;
            data = Mustache.render(dirent.data, context);
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
