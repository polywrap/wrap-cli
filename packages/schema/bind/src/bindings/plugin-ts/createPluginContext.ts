import { toImportablePath } from "../../utils/toImportablePath";

import { InvokableModules, Manifest, MetaManifest } from "@web3api/core-js";
import { TypeInfo } from "@web3api/schema-parse";
import { camelCase, upperFirst } from "lodash";

export type PluginContextOptions = {
  manifest: Manifest;
  metaManifest?: MetaManifest;
  typeInfo: TypeInfo;
};

export type PluginContextModules = {
  [module in InvokableModules]?: {
    env?: {
      modulePath: string;
    };
    modulePath: string;
  };
};

export type PluginContext = {
  className: string;
  funcName: string;
  modules: PluginContextModules;
};

export function createPluginContext(opts: PluginContextOptions): PluginContext {
  // Use name from manifest if specified otherwise call it NewPlugin by default
  const funcName = camelCase(
    !opts.metaManifest ? "new" : opts.metaManifest.name
  );
  const className = upperFirst(funcName);
  const modules: PluginContextModules = {};
  for (const [module, paths] of Object.entries(opts.manifest.modules)) {
    const invokableModule = module as InvokableModules;
    if (!paths) {
      throw new Error(
        `Manifest is missing module and schema paths for ${invokableModule}`
      );
    }
    if (!paths.module) {
      throw new Error(
        `Manifest is missing a module path for ${invokableModule}`
      );
    }

    const modulePath = toImportablePath(paths.module);
    let envModulePath: string | undefined;
    if (opts.typeInfo.envTypes[module as InvokableModules]) {
      if (opts.typeInfo.envTypes[invokableModule].sanitized) {
        envModulePath = `${modulePath}/w3`;
      }
    }
    modules[invokableModule] = {
      modulePath: toImportablePath(paths.module),
      env: envModulePath ? { modulePath: envModulePath } : undefined,
    };
  }
  return {
    className,
    funcName,
    modules,
  };
}
