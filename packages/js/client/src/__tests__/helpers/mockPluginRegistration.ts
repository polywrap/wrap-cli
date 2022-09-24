import { toUri, Uri } from "@polywrap/core-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export const mockPluginRegistration = (uri: string | Uri) => {
  return {
    uri: toUri(uri),
    package: new PluginPackage(
      {} as WrapManifest,
      ({} as unknown) as PluginModule<{}>
    ),
  };
};
