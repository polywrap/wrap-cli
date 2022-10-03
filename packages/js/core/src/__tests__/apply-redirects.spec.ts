import {
  Uri,
  applyRedirects
} from "../";

describe("applyRedirects", () => {

  it("works with the typical use case", () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";

    const redirectsResult = applyRedirects(new Uri(uri1), [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        }
    ]);

    expect (redirectsResult.ok).toBeTruthy();
    if (!redirectsResult.ok) {
      throw Error("This should never happen");
    }

    const redirectedUri = redirectsResult.value;
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTruthy();
  });

  it("works with the redirect stack overrides", () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const uri3 = "wrap://ens/some-uri3.eth";

    const redirectsResult = applyRedirects(new Uri(uri1), [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        },
        {
            from: new Uri(uri1),
            to: new Uri(uri3)
        }
    ]);

    expect (redirectsResult.ok).toBeTruthy();
    if (!redirectsResult.ok) {
      throw Error("This should never happen");
    }

    const redirectedUri = redirectsResult.value;
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTruthy();
  });

  it("can not redirect to self", () => {
    const uri = "wrap://ens/some-uri.eth";

    const redirectsResult = applyRedirects(new Uri(uri), [
      {
        from: new Uri(uri),
        to: new Uri(uri)
      }
    ]);

    expect(redirectsResult.ok).toBeFalsy();
    if (redirectsResult.ok) {
      throw Error("This should never happen");
    }

    const err = redirectsResult.error?.message;
    expect(err).toContain("Infinite loop while resolving URI");
  });
});
