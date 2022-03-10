import { intlMsg } from "../";

import chokidar from "chokidar";

export type WatchEventType =
  | "add"
  | "addDir"
  | "change"
  | "unlink"
  | "unlinkDir";

export const watchEventNames: Record<WatchEventType, string> = {
  add: "File Added",
  addDir: "Folder Added",
  change: "File Changed",
  unlink: "File Removed",
  unlinkDir: "Folder Removed",
};

export function watchEventName(type: WatchEventType): string {
  return watchEventNames[type];
}

export interface WatchEvent {
  type: WatchEventType;
  path: string;
}

export interface WatchOptions extends chokidar.WatchOptions {
  execute: (events: WatchEvent[]) => Promise<void>;
}

interface WatchSession {
  stop: () => Promise<void>;
  directory: string;
}

export class Watcher {
  private _session: WatchSession | undefined;

  public start(directory: string, options: WatchOptions): void {
    if (this._session) {
      const alreadyWatching = intlMsg.lib_watcher_alreadyWatching({
        dir: this._session.directory,
      });
      throw Error(alreadyWatching);
    }

    const watcher = chokidar.watch(directory, options);
    let backlog: WatchEvent[] = [];

    // Watch all file system events
    watcher.on("all", (type: WatchEventType, path: string) => {
      // Add the event to the backlog if it doesn't exist
      if (!backlog.some((e) => e.path == path && e.type == type)) {
        backlog.push({ type, path });
      }
    });

    // Process the event backlog on a given interval
    let instance: ReturnType<typeof setInterval>;
    const interval = options.interval || 1000;

    const updateLoop = async () => {
      if (backlog.length > 0) {
        // Reset the interval
        clearInterval(instance);

        // Execute
        await options.execute(backlog);

        // Reset the backlog
        backlog = [];

        // Start a new interval
        instance = setInterval(updateLoop, interval);
      }
    };

    instance = setInterval(updateLoop, interval);

    this._session = {
      stop: async () => {
        await watcher.close();
        clearInterval(instance);
      },
      directory,
    };
  }

  public async stop(): Promise<void> {
    if (this._session) {
      await this._session.stop();
      this._session = undefined;
    }
  }
}
