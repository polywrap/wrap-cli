import { Logger, logActivity } from "../logging";
import { displayPath, intlMsg } from "../";

import { normalizePath } from "@polywrap/os-js";
import { MetaManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";
import path from "path";

export async function outputMetadata(
  metaManifest: MetaManifest,
  outputDir: string,
  rootDir: string,
  logger: Logger
): Promise<MetaManifest> {
  const result: MetaManifest = {
    ...metaManifest,
    icon: undefined,
    links: undefined,
  };

  const writeMetadataFile = (
    filePath: string,
    outputFilePath: string,
    logger: Logger
  ): string => {
    const outputPath = path.join(outputDir, outputFilePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(path.join(rootDir, filePath), outputPath);

    logger.info(
      `✅` +
        intlMsg.lib_compiler_outputMetadataFileText({
          path: displayPath(normalizePath(outputPath)),
        })
    );

    return displayPath(normalizePath(outputFilePath));
  };

  const run = (logger: Logger) => {
    const writeFile = (filePath: string, subDir: string): string => {
      return writeMetadataFile(
        filePath,
        path.join("meta", subDir, path.basename(filePath)),
        logger
      );
    };

    if (metaManifest.icon) {
      result.icon = writeFile(metaManifest.icon, "icon/");
    }

    if (metaManifest.links) {
      result.links = [];

      for (const link of metaManifest.links) {
        result.links.push({
          ...link,
        });

        if (link.icon) {
          result.links[result.links.length - 1].icon = writeFile(
            link.icon,
            "links/"
          );
        }
      }
    }
  };

  await logActivity(
    logger,
    intlMsg.lib_compiler_outputMetadataText(),
    intlMsg.lib_compiler_outputMetadataError(),
    intlMsg.lib_compiler_outputMetadataWarning(),
    async (logger) => {
      return run(logger);
    }
  );

  return result;
}
