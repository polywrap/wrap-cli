// TODO:
// multiple uri-resolver + api-resolvers
// new plugin that's a URI resolver
// new web3api URI that's a URI resolver
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])

// TODO:
// For core API's have the URI be: w3://w3/uri-resolver

// TODO:
/*
- static implements for plugins (should be modulelevel, not instance level)
- solidify difference between redirects and implementations (confusing right now)

- as the "key", list the name of the URI,
- forwards you to another URI as a redirects, or an "implements"
- have multiple implements
*/

import { resolveUri } from "../algorithms";
import { Uri, UriRedirect } from "../types";

describe("resolveUri", () => {

  // TODO:
  // - create PluginFactory type () => Plugin
  // - have the to: be a factory + the implements

  // TODODODODOD
  /*
    redirects: uri => uri | { pluginfactory, implements }

    {
      from: "w3/uri-resolver",
      to: "ens/uri-resolver.arweave"
    },
    {
      from: "ens/ipfs.web3api.eth",
      to: () => new IpfsPlugin("...")
    },
    {
      from: "ens/ipfs.web3api.eth",
      to: {
        create: () => new IpfsPlugin("..."),
        implements: IpfsPlugin.implements()
      }
    }
  */

  // getImplementations => for (redirects) redirect.match(uri)

  const redirects: UriRedirect[] = [
    {
      from: new Uri("w3://authority/my-uri-resolver"),
      to: {
        implements: MyUriResolver.Implements(),
        factory: () => new MyUriResolver()
      }
    }
  ]



  it("works in the typical case", () => {
    resolveUri(
      new Uri("ens/test.eth"),
      
    )
  });
});
