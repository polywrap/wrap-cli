import {
  defaultDocsManifest,
  defaultPolywrapManifest,
  intlMsg,
  parseLogFileOption,
  parseManifestFileOption,
} from "../lib";
import { getSchemaString } from "./manifest";
import { BaseCommandOptions, Command, Program } from "./types";
import { createLogger } from "./utils/createLogger";

import fse from "fs-extra";

const pathStr = intlMsg.commands_docs_init_m_path();
const defaultManifestStr = defaultPolywrapManifest.join(" | ");

export interface DocsInitCommandOptions extends BaseCommandOptions {
  manifestFile: string;
}

export const docs: Command = {
  setup: (program: Program) => {
    const docsCommand = program
      .command("docs")
      .description(intlMsg.commands_docs_description());

    docsCommand
      .command("init")
      .alias("i")
      .description(intlMsg.commands_docs_init_description())
      .option(
        `-m, --manifest-file <${pathStr}>`,
        `${intlMsg.commands_docs_options_m({
          default: defaultManifestStr,
        })}`
      )
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${pathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (options: Partial<DocsInitCommandOptions>) => {
        await runDocsInitCommand({
          manifestFile: parseManifestFileOption(
            options.manifestFile,
            defaultPolywrapManifest
          ),
          dir: options.dir || false,
          force: options.force || false,
          logFile: parseLogFileOption(options.logFile),
          quiet: options.quiet || false,
          verbose: options.verbose || false,
        });
      });
  },
};

export const runDocsInitCommand = async (
  options: Required<DocsInitCommandOptions>
): Promise<void> => {
  const {
    verbose,
    quiet,
    logFile,
    manifestFile
  } = options;

  const logger = createLogger({ verbose, quiet, logFile });

  const docsManifestExists = fse.existsSync(defaultDocsManifest[0]);

  if (docsManifestExists) {
    logger.error(
      intlMsg.commands_docs_init_error_manifest_exists({
        manifestFile: defaultDocsManifest[0]
      })
    );
    process.exit(1);
  }

  let docsManifest = await getSchemaString(logger, "docs", {
    verbose: false,
    quiet: true,
    logFile: false,
    raw: false,
    manifestFile: false
  });

  fse.writeFileSync(defaultDocsManifest[0], docsManifest);

  logger.info(
    intlMsg.commands_docs_init_msg_manifest_created({
      manifestFile: defaultDocsManifest[0]
    })
  );

  logger.warn(
    intlMsg.commands_docs_init_warn_update_manifest({
      manifestFile,
      docsManifestFile: defaultDocsManifest[0]
    })
  );
};
