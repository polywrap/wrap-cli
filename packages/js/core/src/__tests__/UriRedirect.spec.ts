import { Uri } from "../";
import { PluginPackage } from "../types";
import { convertToUriRedirects } from "../types/UriRedirect";

describe("convertToUriRedirects", () => {
  it("Returns empty array if empty array passed", () => {
    const redirects = convertToUriRedirects([]);

    expect(redirects).toEqual([]);
  });

  it("Returns uri redirects from uri redirect definitions", () => {
    const redirects = convertToUriRedirects([
      {
        from: "w3://w3/api",
        to: "w3://w3/api"
      },
      {
        from: "w3://w3/api",
        to: {} as PluginPackage,
      }
    ]);

    expect(redirects).toEqual([
      {
        from: new Uri("w3://w3/api"),
        to: new Uri("w3://w3/api")
      },
      {
        from: new Uri("w3://w3/api"),
        to: {} as PluginPackage,
      }
    ]);
  });
});
