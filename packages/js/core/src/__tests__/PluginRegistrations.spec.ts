import { Uri } from "../";
import { PluginPackage, sanitizePluginRegistrations } from "../types";

describe("sanitizePluginRegistrations", () => {
  it("Returns empty array if empty array passed", () => {
    const plugins = sanitizePluginRegistrations([]);

    expect(plugins).toEqual([]);
  });

  it("Returns plugins from plugins definitions", () => {
    const plugins = sanitizePluginRegistrations([
      {
        uri: "wrap://polywrap/wrapper",
        plugin: {} as PluginPackage<{}>,
      }
    ]);

    expect(plugins).toEqual([
      {
        uri: new Uri("wrap://polywrap/wrapper"),
        plugin: {} as PluginPackage<{}>
      }
    ]);
  });
});
