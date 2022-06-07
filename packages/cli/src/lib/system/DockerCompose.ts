/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDockerFileLock } from "./docker";

import path from "path";
import Commands, { IDockerComposeOptions } from "docker-compose";
import { InfraManifest } from "@web3api/core-js";

export class DockerCompose {
  private _dockerLock = getDockerFileLock();
  public commands: typeof Commands;

  constructor() {
    this.commands = Object.fromEntries(
      Object.entries(Commands).map(([name, func]) => [
        name,
        this._wrapInDockerLock(func),
      ])
    ) as typeof Commands;
  }

  static getDefaultConfig(
    baseDockerComposePath: string,
    infraManifest: InfraManifest,
    quiet: boolean
  ): Partial<IDockerComposeOptions> {
    return {
      cwd: path.dirname(baseDockerComposePath),
      env: {
        ...infraManifest.env,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PATH: process.env.PATH,
      } as Record<string, string>,
      log: !quiet,
    };
  }

  private _wrapInDockerLock<T extends (...args: any) => any>(fn: T): T {
    return (async (...args: Parameters<typeof fn>) => {
      await this._dockerLock.request();
      let res: ReturnType<T>;

      try {
        res = await fn(...args);
        await this._dockerLock.release();
      } catch (e) {
        await this._dockerLock.release();
        throw e;
      }

      return res;
    }) as T;
  }
}
