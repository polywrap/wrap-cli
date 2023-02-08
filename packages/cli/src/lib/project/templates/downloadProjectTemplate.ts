import { UrlFormat } from "../../../commands";
import { createUUID } from "../../helpers";
import { runCommand } from "../../system";
import { Logger } from "../../logging";

import path from "path";
import fse from "fs-extra";

function parseUrlFormat(url: string): UrlFormat | undefined {
  // TODO: better url validation
  if (url.startsWith("http") && url.endsWith(".git")) {
    return UrlFormat.git;
  } else {
    return undefined;
  }
}

function createCacheDir(): string {
  const cacheDir = `.polywrap/templates/${createUUID()}`;
  if (!fse.existsSync(cacheDir)) {
    fse.mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
}

export const downloadProjectTemplate = (
  url: string,
  projectDir: string,
  logger: Logger
): Promise<boolean | { command: string }> => {
  return new Promise((resolve, reject) => {
    const cacheDir = createCacheDir();
    const format = parseUrlFormat(url);

    if (format === UrlFormat.git) {
      const command = "git clone";
      const args = ["--depth", "1", "--single-branch", url];
      const repoName = path.basename(url, ".git");
      const repoDir = path.join(cacheDir, repoName);
      const dotGitPath = path.join(repoDir, "/.git/");

      runCommand(command, args, logger, undefined, cacheDir)
        .then(() => fse.rm(dotGitPath, { recursive: true, force: true }))
        .then(() => {
          fse
            .copy(repoDir, projectDir, {
              overwrite: true,
            })
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              reject({
                command: `copy ${repoDir} ${projectDir}`,
              });
            });
        })
        .catch(() => {
          reject({ command: `${command} ${args.join(" ")}` });
        });
    } else {
      reject(`Invalid URL format: ${url}`);
    }
  });
};
