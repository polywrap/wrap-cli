/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module } from "./types";

import YAML from "js-yaml";
import fs from "fs";

export interface Manifest {
  dockerCompose: Record<string, any>;
  modules: {
    [key: string]: Module;
  };
}

export const parseManifest = <T extends Record<string, any>>(
  manifestPath: string
): T => {
  const manifestData = YAML.safeLoad(
    fs.readFileSync(manifestPath, "utf-8")
  ) as T;

  return {
    ...manifestData,
    modules: manifestData?.modules || {},
  };
};
