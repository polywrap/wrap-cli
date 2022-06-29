import { Uri, PluginFactory, PluginRegistration } from "../types";

import { Tracer } from "@polywrap/tracing-js";

export const findPluginRegistration = Tracer.traceFunc(
  "core: findPluginRegistration",
  (
    uri: Uri,
    plugins: readonly PluginRegistration<Uri>[]
  ): PluginFactory<unknown> | undefined => {
    const pluginRedirect = plugins.find((x) => Uri.equals(x.uri, uri));
    return pluginRedirect?.plugin;
  }
);
