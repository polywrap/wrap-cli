import { SourceBuildStrategy } from "../SourceBuilder";
import { displayPath, runCommand } from "../../system";
import { withSpinner } from "../../helpers";
import { intlMsg } from "../../intl";

import path from "path";

export class LocalBuildStrategy extends SourceBuildStrategy<void> {
  public async build(): Promise<void> {
    const run = async () => {
      const manifestDir = await this.project.getManifestDir();
      const bindLanguage = await this.project.getManifestLanguage();
      const abortPath = path.relative(
        process.cwd(),
        path.join(manifestDir, "src/wrap/entry/wrapAbort")
      );
      const scriptPath = `${__dirname}/../../defaults/build-scripts/${bindLanguage}.sh`;
      const command = `chmod +x ${scriptPath} && ${scriptPath} ${manifestDir} ${this.outputDir} ${abortPath}`;

      await runCommand(command, this.project.quiet, undefined, process.cwd());
    };

    if (this.project.quiet) {
      return await run();
    } else {
      const args = {
        path: displayPath(this.outputDir),
      };
      return (await withSpinner(
        intlMsg.lib_helpers_copyText(args),
        intlMsg.lib_helpers_copyError(args),
        intlMsg.lib_helpers_copyWarning(args),
        async (_spinner) => {
          return await run();
        }
      )) as void;
    }
  }
}
