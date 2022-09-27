import { BuildStrategy } from "../BuildStrategy";
import { displayPath, runCommand } from "../../system";
import { withSpinner } from "../../helpers";
import { intlMsg } from "../../intl";
import { BuildManifestConfig } from "../../project";

export class LocalBuildStrategy extends BuildStrategy<void> {
  public async build(): Promise<void> {
    const run = async () => {
      const bindLanguage = await this.project.getManifestLanguage();
      const buildManifest = await this.project.getBuildManifest();
      const buildManifestConfig = buildManifest.config as BuildManifestConfig;

      if (buildManifestConfig.polywrap_module) {
        let scriptPath = `${__dirname}/../../defaults/build-scripts/${bindLanguage}.sh`;

        if (bindLanguage.startsWith("wasm")) {
          const lang = bindLanguage.split("/")[1] as "assemblyscript" | "rust";
          const customScript =
            buildManifest.strategies?.local?.[lang]?.scriptPath;
          scriptPath = customScript ?? scriptPath;
        }

        const command = `chmod +x ${scriptPath} && ${scriptPath} ${buildManifestConfig.polywrap_module.dir} ${this.outputDir}`;

        await withSpinner(
          intlMsg.lib_helpers_buildText(),
          intlMsg.lib_helpers_buildError(),
          intlMsg.lib_helpers_buildWarning(),
          async (_spinner) => {
            return await runCommand(
              command,
              this.project.quiet,
              undefined,
              process.cwd()
            );
          }
        );
      }
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
