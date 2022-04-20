import fs from "fs";
import rimraf from "rimraf";

export function resetDir(dir: string) {
  if (fs.existsSync(dir)) {
    rimraf.sync(dir);
  }

  fs.mkdirSync(dir, { recursive: true });
}
