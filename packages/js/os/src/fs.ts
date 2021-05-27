import fs from "fs";
import os from "os";

export function writeFileSync(
  path: fs.PathLike | number,
  data: unknown,
  options?: fs.WriteFileOptions
): void {
  if (typeof data === "string") {
    data = normalizeLineEndings(data);
  }

  fs.writeFileSync(path, data, options);
}

export function normalizeLineEndings(
  data: string,
  eol: string = os.EOL
): string {
  return data.replace(/\r\n|\r|\n/g, eol);
}
