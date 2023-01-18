import JSZip from "jszip";
import sanitize from "sanitize-filename";
import fse from "fs-extra";
import path from "path";

export class Zip {
  private _zip: JSZip;

  constructor() {
    this._zip = new JSZip();
  }

  private _generateNodeZip(filePath: string) {
    return new Promise<boolean>((res, rej) => {
      this._zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
          .pipe(fse.createWriteStream(filePath))
          .on("error", (err) => {
            rej(err);
          })
          .on('finish', function () {
            res(true)
          });
        })
  }

  public createZip(sourceDir: string, outputPath: string): Promise<boolean> {
    if (!fse.lstatSync(sourceDir).isDirectory()) {
      throw new Error(`Zip sourceDir '${sourceDir}' is not a directory.`);
    }

    fse.readdirSync(sourceDir).forEach(file => {
      const filePath = path.join(sourceDir, sanitize(file));
      this._zip.file(file, fse.readFileSync(filePath))
    })
    return this._generateNodeZip(outputPath);
  }
}