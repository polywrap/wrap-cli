import { createUUID } from "../../helpers";
import { runCommand } from "../../system";
import { Logger } from "../../logging";
import { intlMsg } from "../../intl";
import { CacheDirectory, globalCacheRoot } from "../../CacheDirectory";

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

async function downloadGitTemplate(
  url: string,
  projectDir: string,
  logger: Logger,
  cacheDir: CacheDirectory
): Promise<void> {
  const command = "git clone";
  const args = ["--depth", "1", "--single-branch", url];
  const repoName = path.basename(url, ".git");
  const dotGitSubPath = path.join(repoName, "/.git/");

  try {
    // clone repo
    await runCommand(command, args, logger, undefined, cacheDir.getCacheDir());
    // remove .git data
    cacheDir.removeCacheDir(dotGitSubPath);
    // copy files from cache to project dir
    await fse.copy(cacheDir.getCachePath(repoName), projectDir, {
      overwrite: true,
    });
  } catch (e) {
    // this is safe because removeCacheDir and fse.copy should not throw
    throw {
      command: "git clone " + args.join(", "),
    };
  } finally {
    // clear cache
    cacheDir.resetCache();
  }
}

export const downloadProjectTemplate = async (
  url: string,
  projectDir: string,
  logger: Logger,
  urlFormat?: UrlFormat
): Promise<void> => {
  urlFormat = urlFormat ?? parseUrlFormat(url);
  const cacheDir = new CacheDirectory(
    {
      rootDir: globalCacheRoot,
      subDir: createUUID(),
    },
    "templates"
  ).initCache();

  if (urlFormat === UrlFormat.git) {
    return downloadGitTemplate(url, projectDir, logger, cacheDir);
  } else {
    throw Error("This should never happen");
  }
};
