import JSZip from "jszip";
import fse from "fs-extra";

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
    fse.readdirSync(sourceDir).forEach(file => {
      this._zip.file(file, fse.readFileSync(`${sourceDir}/${file}`))
    })
    return this._generateNodeZip(outputPath);
  }
}