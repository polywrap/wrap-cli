import path from "path";
import { readFileSync, existsSync } from "fs";

import { normalizeLineEndings } from "@polywrap/os-js";
import { latestWrapManifestVersion, WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const GetPathToBindTestFiles = () => `${__dirname}/cases/bind`
export const GetPathToComposeTestFiles = () => `${__dirname}/cases/compose`
export const GetPathToParseTestFiles = () => `${__dirname}/cases/parse`
export const GetPathToTestWrappers = () => `${__dirname}/cases/wrappers`
export const GetPathToCliTestFiles = () => `${__dirname}/cases/cli`;

export function readFileIfExists(
  file: string,
  directory: string,
  absolute = false
): string | undefined {
  const filePath = getFilePath( 
    file,
    directory,
    absolute
  );

  if (existsSync(filePath)) {
    return normalizeLineEndings(
      readFileSync(filePath, { encoding: "utf-8" }),
      "\n"
    );
  } else {
    return undefined;
  }
};

export async function readNamedExportIfExists<TExport>(
  namedExport: string,
  file: string,
  directory: string,
  absolute = false
): Promise<TExport | undefined> {
  const filePath = getFilePath(file, directory, absolute);

  if (existsSync(filePath)) {
    const module = await import(filePath);

    if (!module[namedExport]) {
      throw Error(
        `Required named export "${namedExport}" is missing in ${filePath}`
      );
    }

    return module[namedExport] as TExport;
  } else {
    return undefined;
  }
}

function getFilePath(
  file: string,
  directory: string,
  absolute = false
): string {
  if (absolute) {
    return file;
  } else {
    return path.join(directory, file);
  }
}

export const mockPluginManifest: WrapManifest = {
  name: "mock",
  type: "plugin",
  version: latestWrapManifestVersion,
  abi: {
    "objectTypes": [],
    "enumTypes": [],
    "interfaceTypes": [],
    "importedObjectTypes": [],
    "importedModuleTypes": [],
    "importedEnumTypes": [],
    "importedEnvTypes": [],
    "moduleType": {
      "type": "Module",
      "name": null,
      "required": null,
      "kind": 128,
      "methods": [
        {
          "type": "Method",
          "name": "getData",
          "required": true,
          "kind": 64,
          "arguments": [],
          "return": {
            "type": "Int",
            "name": "getData",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Int",
              "name": "getData",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "setData",
          "required": true,
          "kind": 64,
          "arguments": [
            {
              "type": "Int",
              "name": "value",
              "required": true,
              "kind": 34,
              "array": null,
              "map": null,
              "scalar": {
                "type": "Int",
                "name": "value",
                "required": true,
                "kind": 4
              },
              "object": null,
              "enum": null,
              "unresolvedObjectOrEnum": null
            }
          ],
          "return": {
            "type": "Boolean",
            "name": "setData",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "Boolean",
              "name": "setData",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        },
        {
          "type": "Method",
          "name": "deployContract",
          "required": true,
          "kind": 64,
          "arguments": [],
          "return": {
            "type": "String",
            "name": "deployContract",
            "required": true,
            "kind": 34,
            "array": null,
            "map": null,
            "scalar": {
              "type": "String",
              "name": "deployContract",
              "required": true,
              "kind": 4
            },
            "object": null,
            "enum": null,
            "unresolvedObjectOrEnum": null
          }
        }
      ],
      "imports": [],
      "interfaces": []
    }
  }
}
