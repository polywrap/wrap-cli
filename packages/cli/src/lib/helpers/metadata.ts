import { withSpinner } from "./";
import { displayPath, intlMsg } from "../";

import { normalizePath } from "@polywrap/os-js";
import { MetaManifest } from "@polywrap/polywrap-manifest-types-js";
import { Ora } from "ora";
import fs from "fs";
import path from "path";

export async function outputMetadata(
  metaManifest: MetaManifest,
  outputDir: string,
  rootDir: string,
  quiet: boolean
): Promise<MetaManifest> {
  const result: MetaManifest = {
    ...metaManifest,
    icon: undefined,
    links: undefined,
    queries: undefined,
  };

  const writeMetadataFile = (
    filePath: string,
    outputFilePath: string,
    spinner?: Ora
  ): string => {
    const outputPath = path.join(outputDir, outputFilePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(path.join(rootDir, filePath), outputPath);

    if (spinner) {
      spinner.succeed(
        intlMsg.lib_compiler_outputMetadataFileText({
          path: displayPath(normalizePath(outputPath)),
        })
      );
    }

    return displayPath(normalizePath(outputFilePath));
  };

  const run = (spinner?: Ora) => {
    const writeFile = (filePath: string, subDir: string): string => {
      return writeMetadataFile(
        filePath,
        path.join("meta", subDir, path.basename(filePath)),
        spinner
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

    if (metaManifest.queries) {
      result.queries = [];

      for (const query of metaManifest.queries) {
        result.queries.push({
          ...query,
        });

        result.queries[result.queries.length - 1].query = writeFile(
          query.query,
          "queries/"
        );

        if (query.vars) {
          result.queries[result.queries.length - 1].vars = writeFile(
            query.vars,
            "queries/"
          );
        }
      }
    }
  };

  if (quiet) {
    run();
  } else {
    await withSpinner(
      intlMsg.lib_compiler_outputMetadataText(),
      intlMsg.lib_compiler_outputMetadataError(),
      intlMsg.lib_compiler_outputMetadataWarning(),
      async (spinner: Ora) => {
        return run(spinner);
      }
    );
  }

  return result;
}
