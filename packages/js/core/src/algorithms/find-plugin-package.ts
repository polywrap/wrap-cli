import { Uri, PluginPackage, PluginRegistration } from "../types";

import { Tracer } from "@web3api/tracing-js";

export const findPluginPackage = Tracer.traceFunc(
  "core: findPluginPackage",
  (
    uri: Uri,
    plugins: readonly PluginRegistration<Uri>[]
  ): PluginPackage | undefined => {
    const pluginRedirect = plugins.find((x) => Uri.equals(x.uri, uri));

    return pluginRedirect?.plugin as PluginPackage | undefined;
  }
);
