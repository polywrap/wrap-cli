import {
  ensureDockerDaemonRunning,
  FileLock,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";

import fse from "fs-extra";
import path from "path";

type BuildImageId = string;
const VOLUME_DIR_CACHE_SUBPATH = "build/volume";

export class DockerVMBuildStrategy extends BuildStrategy<BuildImageId> {
  private _dockerLock: FileLock;

  constructor(args: BuildStrategyArgs) {
    super(args);

    if (!isDockerInstalled()) {
      throw new Error(intlMsg.lib_docker_noInstall());
    }

    this._dockerLock = new FileLock(
      this.project.getCachePath("build/DOCKER_LOCK"),
      (msg) => {
        throw new Error(msg);
      }
    );
  }

  public async build(): Promise<string> {
    await this._dockerLock.request();
    try {
      await ensureDockerDaemonRunning();
      const cacheDir = this.project.getCachePath(VOLUME_DIR_CACHE_SUBPATH);
      const manifestDir = this.project.getManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const includePaths = (buildManifest.config?.include as string[]) || [];
      const scriptPath = path.join(__dirname, "..", "..", "defaults", "build-vm", "scripts");

      includePaths
        .map((includePath) => path.join(manifestDir, includePath))
        .forEach((includePath) => {
          if (!fse.existsSync(includePath)) {
            throw new Error(
              `File to include with path ${includePath} does not exist`
            );
          }

          fse.copySync(includePath, path.join(cacheDir, includePath));
        });

      await runCommand(
        `docker run -v ${path.resolve(
          cacheDir
        )}:/project --name vm-build-container polywrap-vm-as /bin/bash ${}`
      );

      await runCommand(`docker run -v ${cacheDir}:/project polywrap-vm-ts`);

      await this._dockerLock.release();

      return "";
    } catch (e) {
      await this._dockerLock.release();
      throw e;
    }
  }
}
