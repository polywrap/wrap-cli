import { createUUID } from "../../helpers";
import { runCommand } from "../../system";
import { Logger } from "../../logging";
import { intlMsg } from "../../intl";

import path from "path";
import fse from "fs-extra";

export enum UrlFormat {
  git = ".git",
}

export function parseUrlFormat(url: string): UrlFormat {
  if (url.startsWith("http") && url.endsWith(".git")) {
    return UrlFormat.git;
  } else {
    const formats = Object.values(UrlFormat).join(", ");
    const message = intlMsg.commands_create_error_badUrl({
      url: `'${url}'`,
      formats,
    });
    throw Error(message);
  }
}

function createCacheDir(): string {
  const cacheDir = path.resolve(`./.polywrap/${createUUID()}`);
  if (!fse.existsSync(cacheDir)) {
    fse.mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
}

async function downloadGitTemplate(
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

  try {
    // clone repo
    await runCommand(command, args, logger, undefined, cacheDir);
    // remove .git data
    await fse.remove(dotGitPath);
    // copy files from cache to project dir
    await fse.copy(repoDir, projectDir, { overwrite: true });
  } finally {
    // remove cache dir
    await fse.remove(cacheDir);
  }
}

export const downloadProjectTemplate = async (
  url: string,
  projectDir: string,
  logger: Logger,
  urlFormat?: UrlFormat
): Promise<void> => {
  urlFormat = urlFormat ?? parseUrlFormat(url);
  const cacheDir = createCacheDir();

  if (urlFormat === UrlFormat.git) {
    return downloadGitTemplate(url, projectDir, logger, cacheDir);
  } else {
    throw Error("This should never happen");
  }
};
