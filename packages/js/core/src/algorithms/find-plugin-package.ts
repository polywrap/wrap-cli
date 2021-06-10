import { Uri, PluginPackage, UriRedirect } from "../types";

import { Tracer } from "@web3api/tracing-js";

export const findPluginPackage = Tracer.traceFunc(
  "core: findPluginPackage",
  (
    uri: Uri,
    redirects: readonly UriRedirect<Uri>[]
  ): PluginPackage | undefined => {
    const pluginRedirect = redirects.find(
      (redirect) => Uri.equals(redirect.from, uri) && !Uri.isUri(redirect.to)
    );

    return pluginRedirect?.to as PluginPackage | undefined;
  }
);
