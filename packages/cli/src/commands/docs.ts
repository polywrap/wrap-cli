import {
  defaultDocsDir,
  defaultDocsManifest,
  intlMsg,
  parseDirOption,
  parseLogFileOption,
} from "../lib";
import { BaseCommandOptions, Command, Program } from "./types";
import { createLogger } from "./utils/createLogger";

import fse from "fs-extra";
import { DocsManifest } from "@polywrap/polywrap-manifest-types-js";
import path from "path";
import YAML from "yaml";

const docsManifestPathStr = intlMsg.commands_docs_init_m_path();
const docsManifestDirStr = intlMsg.commands_docs_init_m_path();

const defaultDocsManifestStr = defaultDocsManifest.join(" | ");

export interface DocsInitCommandOptions extends BaseCommandOptions {
  manifestFile: string | false;
  dir: string | false;
  force: boolean;
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
        `-m, --manifest-file <${docsManifestPathStr}>`,
        `${intlMsg.commands_docs_options_m({
          default: defaultDocsManifestStr,
        })}`
      )
      .option(
        `-d, --dir <${docsManifestDirStr}>`,
        `${intlMsg.commands_docs_options_d({
          default: defaultDocsDir,
        })}`
      )
      .option(`-f, --force`, intlMsg.commands_docs_options_f())
      .option("-v, --verbose", intlMsg.commands_common_options_verbose())
      .option("-q, --quiet", intlMsg.commands_common_options_quiet())
      .option(
        `-l, --log-file [${docsManifestPathStr}]`,
        `${intlMsg.commands_build_options_l()}`
      )
      .action(async (options: Partial<DocsInitCommandOptions>) => {
        await runDocsInitCommand({
          manifestFile: options.manifestFile || false,
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
  const { verbose, quiet, logFile, force } = options;

  const manifestFile = options.manifestFile || defaultDocsManifest[0];
  const dir = parseDirOption(options.dir, "./docs");

  const logger = createLogger({ verbose, quiet, logFile });

  const manifestFileExists = fse.existsSync(manifestFile);
  const dirExists = fse.existsSync(dir);

  if (!force) {
    if (manifestFileExists) {
      logger.error(
        intlMsg.commands_docs_init_error_manifest_exists({ manifestFile })
      );
    }

    if (dirExists) {
      logger.error(intlMsg.commands_docs_init_error_dir_exists({ dir }));
    }

    if (manifestFileExists || dirExists) {
      process.exit(1);
    }
  }

  if (manifestFileExists) {
    fse.rmSync(manifestFile);
  }

  if (dirExists) {
    fse.rmdirSync(dir);
  }

  const sampleReadmeOutputPath = path.relative(
    process.cwd(),
    path.join(dir, "home.md")
  );

  const manifest: DocsManifest = {
    format: "0.1.0",
    description: "Description of my Wrap",
    readme: sampleReadmeOutputPath,
    websiteUrl: "https://example.com",
    repositoryUrl: "https://github.com/polywrap",
    // eslint-disable-next-line
    __type: "DocsManifest",
  };

  const cleanedManifest = JSON.parse(JSON.stringify(manifest));
  delete cleanedManifest.__type;

  const manifestContents = YAML.stringify(cleanedManifest, null, 2);

  const manifestFileDir = path.dirname(manifestFile);

  if (!fse.existsSync(manifestFileDir)) {
    await fse.mkdir(manifestFileDir, { recursive: true });
  }

  await fse.writeFile(manifestFile, manifestContents);

  logger.info(
    intlMsg.commands_docs_init_msg_manifest_created({ manifestFile })
  );

  if (!fse.existsSync(dir)) {
    await fse.mkdir(dir, { recursive: true });
  }

  const sampleReadmeFile = path.join(
    __dirname,
    "../lib/docs/templates/readme.md"
  );

  logger.info(
    intlMsg.commands_docs_init_msg_markdown_created({ sampleReadmeFile })
  );

  await fse.copyFile(sampleReadmeFile, sampleReadmeOutputPath);

  logger.info(intlMsg.commands_docs_init_success_end());

  return;
};
