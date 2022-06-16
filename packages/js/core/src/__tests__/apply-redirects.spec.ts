import {
  Uri,
  applyRedirects
} from "../";

describe("applyRedirects", () => {

  it("works with the typical use case", () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";

    const redirectedUri = applyRedirects(new Uri(uri1), [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        }
    ]);
    
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTruthy();
  });

  it("works with the redirect stack overrides", () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const uri3 = "wrap://ens/some-uri3.eth";

    const redirectedUri = applyRedirects(new Uri(uri1), [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        },
        {
            from: new Uri(uri1),
            to: new Uri(uri3)
        }
    ]);
    
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTruthy();
  });

  it("can not redirect to self", () => {
    const uri = "wrap://ens/some-uri.eth";

    expect(() => {
      applyRedirects(new Uri(uri), [
        {
            from: new Uri(uri),
            to: new Uri(uri)
        }
      ]);
    }).toThrow(/Infinite loop while resolving URI/);
  });
});
