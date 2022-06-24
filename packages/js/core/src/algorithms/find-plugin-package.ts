import { Uri, PluginPackage, PluginRegistration } from "../types";

import { Tracer } from "@polywrap/tracing-js";

export const findPluginPackage = Tracer.traceFunc(
  "core: findPluginPackage",
  (
    uri: Uri,
    plugins: readonly PluginRegistration<Uri>[]
  ): PluginPackage<unknown> | undefined => {
    const pluginRedirect = plugins.find((x) => Uri.equals(x.uri, uri));

    return pluginRedirect?.plugin as PluginPackage<unknown> | undefined;
  }
);
