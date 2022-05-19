import { Command, Program } from "./types";
import {
  intlMsg,
  isDockerInstalled,
  getDockerFileLock,
  startupTestEnv,
  shutdownTestEnv
} from "../lib";

export const testEnv: Command = {
  setup: (program: Program) => {
    const testEnvCommand = program
      .command("test-env")
      .alias("t")
      .description(intlMsg.commands_testEnv_description());

    testEnvCommand
      .command("up")
      .description(intlMsg.commands_testEnv_options_start())
      .action(async (options) => {
        await run("start");
      });

    testEnvCommand
      .command("down")
      .description(intlMsg.commands_testEnv_options_stop())
      .action(async (options) => {
        await run("stop");
      });
  }
}

async function run(startStop: "start" | "stop") {
  if (!isDockerInstalled()) {
    throw new Error(intlMsg.lib_docker_noInstall());
  }

  const dockerLock = getDockerFileLock();
  await dockerLock.request();

  if (startStop === "start") {
    // TODO: create more robust logger
    console.log(intlMsg.commands_testEnv_startup_text());

    try {
      await startupTestEnv(true);
      await dockerLock.release();
    } catch (e) {
      console.error(intlMsg.commands_testEnv_startup_error());
      throw e;
    }
  } else if (startStop === "stop") {
    // TODO: create more robust logger
    console.log(intlMsg.commands_testEnv_shutdown_text());

    try {
      // TODO: this should be configurable & stream the docker ouput to console for added info
      await shutdownTestEnv(true);
      await dockerLock.release();
    } catch (e) {
      console.error(intlMsg.commands_testEnv_shutdown_error());
      throw e;
    }
  } else {
    await dockerLock.release();
    throw Error(intlMsg.commands_testEnv_error_never());
  }
}
