import path from "path";
import { readFileSync, existsSync } from "fs";
import { normalizeLineEndings } from "@polywrap/os-js";

export function readFileIfExists(
  filePath: string
): string | undefined {
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
  filePath: string
): Promise<TExport | undefined> {
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

export function getFilePath(
  file: string,
  directory: string
): string {
  if (path.isAbsolute(file)) {
    return file;
  } else {
    return path.join(directory, file);
  }
}
