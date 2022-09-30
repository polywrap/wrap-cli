import { Uri } from "@polywrap/core-js";
import { PluginPackage } from "@polywrap/plugin-js";

export const mockPluginRegistration = (uri: string | Uri) => {
  return {
    uri: Uri.from(uri),
    package: PluginPackage.from(
      () => ({
        simpleMethod: (_: unknown): string => {
          return "plugin response";
        }
      })
    ),
  };
};
