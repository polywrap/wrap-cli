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
