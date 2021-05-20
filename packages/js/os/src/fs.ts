import fs from "fs";
import os from "os";

export function writeFileSync(
  path: fs.PathLike | number,
  data: unknown,
  options?: fs.WriteFileOptions
): void {
  if (typeof data === "string") {
    data = data.replace(/\r\n|\r|\n/g, os.EOL);
  }

  fs.writeFileSync(path, data, options);
}
