import {
  Uri,
  CoreClient,
  UriResolutionContext,
} from "@polywrap/core-js";
import { InfiniteLoopError, RecursiveResolver, UriResolver } from "../helpers";
import { StaticResolver } from "../static";

describe("redirects", () => {
  it("sanity - UriResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const resolver = UriResolver.from([
      { from: uri1, to: uri2 }
    ]);

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri2);
  });

  it("sanity - StaticResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const resolver = StaticResolver.from([
      { from: uri1, to: uri2 }
    ]);

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri2);
  });

  it("works with the redirect stack overrides - RecursiveResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const uri3 = "wrap://ens/some-uri3.eth";

    const resolver = RecursiveResolver.from([
      {
        from: new Uri(uri1),
        to: new Uri(uri2)
      },
      {
        from: new Uri(uri2),
        to: new Uri(uri3)
      }
    ]);

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri3);
  });

  it("works with the redirect stack overrides - RecursiveResolver with StaticResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";
    const uri3 = "wrap://ens/some-uri3.eth";

    const resolver = RecursiveResolver.from(
      StaticResolver.from([
        {
          from: new Uri(uri1),
          to: new Uri(uri2)
        },
        {
          from: new Uri(uri2),
          to: new Uri(uri3)
        }
      ])
    );

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri3);
  });

  it("can not redirect to self - RecursiveResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";

    const resolver = RecursiveResolver.from([
      {
        from: new Uri(uri1),
        to: new Uri(uri2)
      },
      {
        from: new Uri(uri2),
        to: new Uri(uri1)
      },
    ]);

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (redirectsResult.ok) {
      console.log(`Expected error`, redirectsResult.value);
      fail();
    }

    expect((redirectsResult.error as InfiniteLoopError).message).toContain("An infinite loop was detected while resolving the URI");
  });


  it("can not redirect to self - RecursiveResolver with StaticResolver", async () => {
    const uri1 = "wrap://ens/some-uri1.eth";
    const uri2 = "wrap://ens/some-uri2.eth";

    const resolver = RecursiveResolver.from(
      StaticResolver.from([
        {
          from: new Uri(uri1),
          to: new Uri(uri2)
        },
        {
          from: new Uri(uri2),
          to: new Uri(uri1)
        },
      ]
    ));

    const redirectsResult = await resolver.tryResolveUri(new Uri(uri1), {} as CoreClient, new UriResolutionContext());

    if (redirectsResult.ok) {
      console.log(`Expected error`, redirectsResult.value);
      fail();
    }

    expect((redirectsResult.error as InfiniteLoopError).message).toContain("An infinite loop was detected while resolving the URI");
  });
});
