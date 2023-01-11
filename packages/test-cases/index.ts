import path from "path";
import { readFileSync, existsSync } from "fs";

import { normalizeLineEndings } from "@polywrap/os-js";
import admZip from 'adm-zip';
import axios from "axios";

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
  // function to fetch file from GitHub release
  async function fetchFromGithub(url: string) {
    // fetch file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file from ${url}`);
    }
    return response.data;
  }

  async function unzipFile(fileBuffer: Buffer, destination: string) {
    // create adm-zip instance
    const zip = new admZip(fileBuffer);
    // extract archive
    zip.extractAllTo(destination, /*overwrite*/ true);
  }

    const download = async () => {
      try {
        const url = "https://github.com/polywrap/wasm-test-harness/archive/refs/tags/v0.2.1.zip";
        const buffer = await fetchFromGithub(url);
        console.log("after the fest")
        const destination = './unzipped';
        await unzipFile(buffer, destination);
        console.log(`File was successfully unzipped to ${destination}`);
      } catch (error) {
        console.log(`An error occurred: ${error.message}`);
      }
    }
    download().then().catch(e => console.log(e))
}