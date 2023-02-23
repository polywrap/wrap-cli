import { intlMsg } from "./intl";
import { AnyProjectManifest, Project } from "./project";
import { Watcher, WatchEvent, watchEventName } from "./system";

import { ILogger } from "@polywrap/logging-js";
import readline from "readline";

export type WatchProjectOptions = {
  execute: () => Promise<boolean>;
  logger: ILogger;
  project: Project<AnyProjectManifest>;
  ignored?: string[];
};

export async function watchProject(
  options: WatchProjectOptions
): Promise<void> {
  const { execute, logger, project, ignored } = options;
  // Execute
  await execute();

  const keyPressListener = () => {
    // Watch for escape key presses
    logger.info(
      `${intlMsg.commands_build_keypressListener_watching()}: ${project.getManifestDir()}`
    );
    logger.info(intlMsg.commands_build_keypressListener_exit());
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on("keypress", async (str, key) => {
      if (
        key.name == "escape" ||
        key.name == "q" ||
        (key.name == "c" && key.ctrl)
      ) {
        await watcher.stop();
        process.kill(process.pid, "SIGINT");
      }
    });

    if (process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
    }

    process.stdin.resume();
  };

  keyPressListener();

  // Watch the directory
  const watcher = new Watcher();

  watcher.start(project.getManifestDir(), {
    ignored: ignored,
    ignoreInitial: true,
    execute: async (events: WatchEvent[]) => {
      // Log all of the events encountered
      for (const event of events) {
        logger.info(`${watchEventName(event.type)}: ${event.path}`);
      }

      // Execute the build
      await execute();

      // Process key presses
      keyPressListener();
    },
  });
}
