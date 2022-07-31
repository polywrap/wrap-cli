/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDockerFileLock } from "./docker";

import path from "path";
import Commands, { IDockerComposeOptions } from "docker-compose";
import { InfraManifest } from "@polywrap/polywrap-manifest-types-js";

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
    quiet: boolean,
    infraManifest?: InfraManifest
  ): Partial<IDockerComposeOptions> {
    const env =
      infraManifest && infraManifest.env
        ? {
            ...process.env,
            ...Object.fromEntries(
              Object.entries(infraManifest.env).map(([key, value]) => [
                key,
                value.toString(),
              ])
            ),
          }
        : process.env;
    return {
      cwd: path.dirname(baseDockerComposePath),
      env,
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
