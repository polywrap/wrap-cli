import { UrlFormat } from "../../../commands";
import { createUUID } from "../../helpers";
import { runCommand } from "../../system";
import { Logger } from "../../logging";

import path from "path";
import fse from "fs-extra";

function parseUrlFormat(url: string): UrlFormat | undefined {
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

function downloadGitTemplate(
  url: string,
  projectDir: string,
  logger: Logger,
  cacheDir: string
): Promise<void> {
  const command = "git clone";
  const args = ["--depth", "1", "--single-branch", url];
  const repoName = path.basename(url, ".git");
  const repoDir = path.join(cacheDir, repoName);
  const dotGitPath = path.join(repoDir, "/.git/");

  return new Promise((resolve, reject) => {
    // clone repo
    runCommand(command, args, logger, undefined, cacheDir)
      .catch(() => reject({ command: `${command} ${args.join(" ")}` }))
      // remove .git data
      .then(() => fse.remove(dotGitPath))
      .catch(() => reject({ command: `rm ${dotGitPath}` }))
      // copy files from cache to project dir
      .then(() => fse.copy(repoDir, projectDir, { overwrite: true }))
      .catch(() => reject({ command: `copy ${repoDir} ${projectDir}` }))
      .then(() => resolve())
      // remove cache dir
      .finally(() =>
        fse.remove(cacheDir).catch(() => reject({ command: `rm ${cacheDir}` }))
      );
  });
}

export const downloadProjectTemplate = async (
  url: string,
  projectDir: string,
  logger: Logger
): Promise<void> => {
  const cacheDir = createCacheDir();
  const format = parseUrlFormat(url);

  if (format === UrlFormat.git) {
    return downloadGitTemplate(url, projectDir, logger, cacheDir);
  } else {
    throw Error(`Invalid URL format: ${url}`);
  }
};
