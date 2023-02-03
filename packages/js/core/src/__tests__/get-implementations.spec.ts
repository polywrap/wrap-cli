import {
  getImplementations,
  Uri,
  IUriRedirect,
  UriPackageOrWrapper,
} from "../";
import { CoreClient, InterfaceImplementations } from "../types";
import { Result, ResultOk } from "@polywrap/result";

const getClient = (redirects: IUriRedirect[]): CoreClient => {
  return {
    tryResolveUri: async ( { uri }: { uri: Uri }): Promise<Result<UriPackageOrWrapper, unknown>> => {
      while (true) {
        const redirect = redirects.find((x) => uri.uri === x.from.uri);
        if (redirect) {
          uri = redirect.to;
        } else {
          return ResultOk({
            type: "uri",
            uri,
          });
        }
      }
    },
  } as CoreClient;
};

describe("getImplementations", () => {

  it("works with complex redirects", async () => {
    const interface1Uri = "wrap://ens/some-interface1.eth";
    const interface2Uri = "wrap://ens/some-interface2.eth";
    const interface3Uri = "wrap://ens/some-interface3.eth";

    const implementation1Uri = "wrap://ens/some-implementation.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";
    const implementation3Uri = "wrap://ens/some-implementation3.eth";

    const redirects: IUriRedirect[] = [
      {
        from: new Uri(interface1Uri),
        to: new Uri(interface2Uri)
      },
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri)
      },
      {
        from: new Uri(implementation2Uri),
        to: new Uri(implementation3Uri)
      }
    ];

    const interfaces: InterfaceImplementations[] = [
      {
        interface: new Uri(interface1Uri),
        implementations: [
          new Uri(implementation1Uri),
          new Uri(implementation2Uri)
        ]
      },
      {
        interface: new Uri(interface2Uri),
        implementations: [
          new Uri(implementation3Uri)
        ]
      },
      {
        interface: new Uri(interface3Uri),
        implementations: [
          new Uri(implementation3Uri)
        ]
      }
    ];

    const getImplementationsResult1 = await getImplementations(
        new Uri(interface1Uri),
        interfaces,
        getClient(redirects)
      );
    const getImplementationsResult2 = await getImplementations(
        new Uri(interface2Uri),
        interfaces,
        getClient(redirects)
      );
    const getImplementationsResult3 = await getImplementations(
        new Uri(interface3Uri),
        interfaces,
        getClient(redirects)
      );

    expect(getImplementationsResult1).toEqual(ResultOk([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]));

    expect(getImplementationsResult2).toEqual(ResultOk([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]));

    expect(getImplementationsResult3).toEqual(ResultOk([
      new Uri(implementation3Uri)
    ]));
  });

  it("interface implementations are not redirected", async () => {
    const interface1Uri = "wrap://ens/some-interface1.eth";

    const implementation1Uri = "wrap://ens/some-implementation.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const redirects: IUriRedirect[] = [
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri)
      }
    ];

    const interfaces: InterfaceImplementations[] = [
      {
        interface: new Uri(interface1Uri),
        implementations: [
          new Uri(implementation1Uri)
        ]
      }
    ];

    const result = await getImplementations(
        new Uri(interface1Uri),
        interfaces,
        getClient(redirects)
      );

    expect(result).toEqual(ResultOk([
      new Uri(implementation1Uri)
    ]));
  });
});
