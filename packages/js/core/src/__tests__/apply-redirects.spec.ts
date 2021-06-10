import {
  Uri,
  applyRedirects
} from "../";

describe("applyRedirects", () => {

  it("works with the typical use case", () => {
    const uri1 = "w3://ens/some-uri1.eth";
    const uri2 = "w3://ens/some-uri2.eth";

    const redirectedUri = applyRedirects(uri1, [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        }
    ]);
    
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTrue();
  });

  it("works with the redirect stack overrides", () => {
    const uri1 = "w3://ens/some-uri1.eth";
    const uri2 = "w3://ens/some-uri2.eth";
    const uri3 = "w3://ens/some-uri3.eth";

    const redirectedUri = applyRedirects(uri1, [
        {
            from: new Uri(uri1),
            to: new Uri(uri2)
        },
        {
            from: new Uri(uri1),
            to: new Uri(uri3)
        }
    ]);
    
    expect(Uri.equals(redirectedUri, new Uri(uri2))).toBeTrue();
  });
});
