import { Functions } from "../";
import { GenerateBindingFn, renderTemplates } from "../..";
import { loadSubTemplates } from "../../utils";
import { BindOptions, BindOutput } from "../../..";

import {
  addFirstLast,
  extendType,
  toPrefixedGraphQLType,
} from "@polywrap/schema-parse";
import { AbiVisitor, IAbiVisitorEnterAndLeave } from "@polywrap/schema-abi";
import { Abi, EnumDef, FunctionDef, ObjectDef } from "@polywrap/abi-types";
import { OutputEntry, readDirectorySync } from "@polywrap/os-js";
import path from "path";

const templatesDir = readDirectorySync(path.join(__dirname, "./templates"));
const subTemplates = loadSubTemplates(templatesDir.entries);
const templatePath = (subpath: string) =>
  path.join(__dirname, "./templates", subpath);

const getImportedObjects = (abi: Abi) => {
  const results: ObjectDef[] = []
  
  abi.imports?.forEach(importedAbi => {
    importedAbi.objects?.forEach(obj => {
      results.push(obj)
    })

    getImportedObjects({
      ...importedAbi,
      version: "0.2"
    })
  })

  return results
}

const getImportedEnums = (abi: Abi) => {
  const results: EnumDef[] = []
  
  abi.imports?.forEach(importedAbi => {
    importedAbi.enums?.forEach(obj => {
      results.push(obj)
    })

    getImportedEnums({
      ...importedAbi,
      version: "0.2"
    })
  })

  return results
}

const getImportedFuncs = (abi: Abi) => {
  const results: FunctionDef[] = []
  
  abi.imports?.forEach(importedAbi => {
    importedAbi.functions?.forEach(obj => {
      results.push(obj)
    })

    getImportedFuncs({
      ...importedAbi,
      version: "0.2"
    })
  })

  return results
}

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

  // Generate object type folders
  if (abi.objects) {
    for (const objectType of abi.objects) {
      output.entries.push({
        type: "Directory",
        name: objectType.name,
        data: renderTemplates(
          templatePath("object-type"),
          objectType,
          subTemplates
        ),
      });
    }
  }

  // Generate imported folder
  const importEntries: OutputEntry[] = [];
  const importedObjects = getImportedObjects(abi)
  const importedEnums = getImportedEnums(abi)
  const importedFuncs = getImportedFuncs(abi)

  // Generate imported module type folders
  for (const importedModuleType of importedFuncs) {
    importEntries.push({
      type: "Directory",
      name: importedModuleType.name,
      data: renderTemplates(
        templatePath("imported/module-type"),
        importedModuleType,
        subTemplates
      ),
    });
  }

  // Generate imported enum type folders
  for (const importedEnumType of importedEnums) {
    importEntries.push({
      type: "Directory",
      name: importedEnumType.name,
      data: renderTemplates(
        templatePath("imported/enum-type"),
        importedEnumType,
        subTemplates
      ),
    });
  }

  // Generate imported object type folders
  for (const importedObectType of importedObjects) {
    importEntries.push({
      type: "Directory",
      name: importedObectType.name,
      data: renderTemplates(
        templatePath("imported/object-type"),
        importedObectType,
        subTemplates
      ),
    });
  }

  if (importEntries.length) {
    output.entries.push({
      type: "Directory",
      name: "imported",
      data: [
        ...importEntries,
        ...renderTemplates(templatePath("imported"), abi, subTemplates),
      ],
    });
  }

  // Generate module type folders
  if (abi.functions) {
    for (const functionType of abi.functions) {
      output.entries.push({
        type: "Directory",
        name: functionType.name,
        data: renderTemplates(
          templatePath("module-type"),
          functionType,
          subTemplates
        ),
      });
    }
  }

  // Generate enum type folders
  if (abi.enums) {
    for (const enumType of abi.enums) {
      output.entries.push({
        type: "Directory",
        name: enumType.name,
        data: renderTemplates(
          templatePath("enum-type"),
          enumType,
          subTemplates
        ),
      });
    }
  }

  // Generate root entry file
  output.entries.push(...renderTemplates(templatePath(""), abi, subTemplates));

  return result;
};

const transformAbi = (abi: Abi, transform: IAbiVisitorEnterAndLeave) => {
  const abiClone: Abi = JSON.parse(JSON.stringify(abi));
  const visitor = new AbiVisitor(transform);

  visitor.visit(abiClone);

  return abiClone;
}

function applyTransforms(abi: Abi): Abi {
  const transforms: IAbiVisitorEnterAndLeave[] = [
    extendType(Functions),
    addFirstLast,
    toPrefixedGraphQLType,
  ];

  for (const transform of transforms) {
    abi = transformAbi(abi, transform);
  }

  return abi;
}
