import { displayPath } from "./path";
import { withSpinner } from "./spinner";
import { getIntl } from "../internationalization";

import fs from "fs";
import YAML from "js-yaml";
import { Manifest, deserializeManifest } from "@web3api/core-js";
import { defineMessages } from "@formatjs/intl";

export async function loadManifest(
  manifestPath: string,
  quiet = false
): Promise<Manifest> {
  const run = (): Promise<Manifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const intl = getIntl();
      const noLoadMessage = intl.formatMessage(
        {
          id: "lib_helpers_manifest_unableToLoad",
          defaultMessage: "Unable to load manifest: {path}",
          description: "",
        },
        { path: `${manifestPath}` }
      );
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeManifest(manifest);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (quiet) {
    return await run();
  } else {
    manifestPath = displayPath(manifestPath);
    const intl = getIntl();
    const messages = defineMessages({
      text: {
        id: "lib_helpers_manifest_loadText",
        defaultMessage: "Load web3api from {path}",
        description: "",
      },
      error: {
        id: "lib_helpers_manifest_loadError",
        defaultMessage: "Failed to load web3api from {path}",
        description: "",
      },
      warning: {
        id: "lib_helpers_manifest_loadWarning",
        defaultMessage: "Warnings loading web3api from {path}",
        description: "",
      },
    });
    const messageArg = { path: `${manifestPath}` };

    return (await withSpinner(
      intl.formatMessage(messages.text, messageArg),
      intl.formatMessage(messages.error, messageArg),
      intl.formatMessage(messages.warning, messageArg),
      async (_spinner) => {
        return await run();
      }
    )) as Manifest;
  }
}

export async function outputManifest(
  manifest: Manifest,
  manifestPath: string,
  quiet = false
): Promise<unknown> {
  const run = () => {
    const str = YAML.safeDump(manifest);

    if (!str) {
      const intl = getIntl();
      const noDumpMessage = intl.formatMessage(
        {
          id: "lib_helpers_manifest_unableToDump",
          defaultMessage: "Unable to dump manifest: {manifest}",
          description: "",
        },
        { manifest: `${manifest}` }
      );
      throw Error(noDumpMessage);
    }

    fs.writeFileSync(manifestPath, str, "utf-8");
  };

  if (quiet) {
    return run();
  } else {
    manifestPath = displayPath(manifestPath);
    const intl = getIntl();
    const messages = defineMessages({
      text: {
        id: "lib_helpers_manifest_outputText",
        defaultMessage: "Output web3api to {path}",
        description: "",
      },
      error: {
        id: "lib_helpers_manifest_outputError",
        defaultMessage: "Failed to output web3api to {path}",
        description: "",
      },
      warning: {
        id: "lib_helpers_manifest_outputWarning",
        defaultMessage: "Warnings outputting web3api to {path}",
        description: "",
      },
    });
    const messageArg = { path: `${manifestPath}` };

    return await withSpinner(
      intl.formatMessage(messages.text, messageArg),
      intl.formatMessage(messages.error, messageArg),
      intl.formatMessage(messages.warning, messageArg),
      (_spinner): Promise<unknown> => {
        return Promise.resolve(run());
      }
    );
  }
}
