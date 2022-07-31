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
        from: "wrap://polywrap/wrapper",
        to: "wrap://polywrap/wrapper"
      }
    ]);

    expect(redirects).toEqual([
      {
        from: new Uri("wrap://polywrap/wrapper"),
        to: new Uri("wrap://polywrap/wrapper")
      }
    ]);
  });
});
