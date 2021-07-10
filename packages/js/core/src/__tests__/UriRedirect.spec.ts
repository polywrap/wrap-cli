import { Uri } from "../";
import { sanitizeUriRedirects } from "../types/UriRedirect";

describe("sanitizeUriRedirects", () => {
  it("Returns empty array if empty array passed", () => {
    const redirects = sanitizeUriRedirects([]);

    expect(redirects).toEqual([]);
  });

  it("Returns uri redirects from uri redirect definitions", () => {
    const redirects = sanitizeUriRedirects([
      {
        from: "w3://w3/api",
        to: "w3://w3/api"
      }
    ]);

    expect(redirects).toEqual([
      {
        from: new Uri("w3://w3/api"),
        to: new Uri("w3://w3/api")
      }
    ]);
  });
});
