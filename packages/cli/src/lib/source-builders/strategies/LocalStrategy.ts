import { SourceBuildStrategy } from "../SourceBuilder";

import path from "path";
import { exec } from "child_process";

export class LocalBuildStrategy extends SourceBuildStrategy<void> {
  public async build(): Promise<void> {
    const manifestDir = await this.project.getManifestDir();

    const bindLanguage = await this.project.getManifestLanguage();
    let abortPath = path.join(manifestDir, "src/wrap/entry/wrapAbort");
    abortPath =
      bindLanguage === "wasm/assemblyscript"
        ? abortPath.replace("./", "")
        : abortPath;
    const scriptPath = `${__dirname}/../../defaults/build-scripts/${bindLanguage}.sh`;
    const command = `chmod +x ${scriptPath} && ${scriptPath} ${manifestDir} ${this.outputDir} ${abortPath}`;

    await new Promise<void>((res, rej) => {
      exec(command, { cwd: manifestDir }, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }
}
