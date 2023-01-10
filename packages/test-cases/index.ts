import path from "path";
import { readFileSync, existsSync } from "fs";

import { normalizeLineEndings } from "@polywrap/os-js";
const shell = require('shelljs');

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

export function fetchWrappers(): void {
  shell.exec("git clone git@github.com:polywrap/wasm-test-harness.git");
  shell.exec("git checkout tags/v0.2.1", { cwd: "./wasm-test-harness" });
  shell.exec("mv ./wrappers ../cases", { cwd: "./wasm-test-harness" });
  shell.exec("rm -rf wasm-test-harness");
}