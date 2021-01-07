// TODO:
// multiple uri-resolver + api-resolvers
// new plugin that's a URI resolver
// new web3api URI that's a URI resolver
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])

// TODO:
// For core API's have the URI be: w3://w3/uri-resolver

import { resolveUri } from "../algorithms";
import { Uri, UriRedirect } from "../types";

describe("resolveUri", () => {

  // TODODODODOD
  /*
    redirects: uri => uri | { pluginfactory, implemented }

    {
      from: "w3/uri-resolver",
      to: "ens/uri-resolver.arweave"
    },
    {
      from: "ens/ipfs.web3api.eth",
      to: {
        factory: () => new IpfsPlugin(),
        manifest: {
          schema: IpfsPlugin.Schema(),
          implemented: IpfsPlugin.implemented(),
          imported: IpfsPlugin.Imported()
        }
      }
    }
  */


  it("works in the typical case", () => {
    resolveUri(
      new Uri("ens/test.eth"),
      
    )
  });
});
