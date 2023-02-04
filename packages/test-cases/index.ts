import path from "path";
import { readFileSync, existsSync } from "fs";

import { normalizeLineEndings } from "@polywrap/os-js";
import admZip from 'adm-zip';
const axios = require("axios");
const shell = require("shelljs");

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

export async function fetchWrappers(): Promise<void> {
  // function to fetch file from GitHub release
  async function fetchFromGithub(url: string) {
    // fetch file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file from ${url}`);
    }
    return response.data;
  }

  function unzipFile(fileBuffer: Buffer, destination: string) {
    // create adm-zip instance
    const zip = new admZip(fileBuffer);
    // extract archive
    zip.extractAllTo(destination, /*overwrite*/ true);
  }

  const tag = "0.0.1-pre.1"
  const repoName = "wasm-test-harness"
  const url = `https://github.com/polywrap/${repoName}/releases/download/${tag}/wrappers.zip`;

  try {
    const buffer = await fetchFromGithub(url);
    const zipBuiltFolder = './output';
    unzipFile(buffer, zipBuiltFolder);
    const wrappersPath = path.join(zipBuiltFolder, "wrappers")
    shell.exec(`mv ${wrappersPath} ./cases`)
    shell.exec(`rm -rf ${zipBuiltFolder}`)
    shell.exec(`rm -rf node_modules`)
    console.log(`Wrappers folder fetch successful`);
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
}