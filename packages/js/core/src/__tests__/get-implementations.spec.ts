import {
  getImplementations,
  Uri,
  UriRedirect,
} from "../";
import { InterfaceImplementations } from "../types";

describe("getImplementations", () => {

  it("works with complex redirects", () => {
    const interface1Uri = "wrap://ens/some-interface1.eth";
    const interface2Uri = "wrap://ens/some-interface2.eth";
    const interface3Uri = "wrap://ens/some-interface3.eth";

    const implementation1Uri = "wrap://ens/some-implementation.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";
    const implementation3Uri = "wrap://ens/some-implementation3.eth";

    const redirects: UriRedirect<Uri>[] = [
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

    const interfaces: InterfaceImplementations<Uri>[] = [
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

    const getImplementationsResult1 = getImplementations(
        new Uri(interface1Uri),
        interfaces,
        redirects
      );
    const getImplementationsResult2 = getImplementations(
        new Uri(interface2Uri),
        interfaces,
        redirects
      );
    const getImplementationsResult3 = getImplementations(
        new Uri(interface3Uri),
        interfaces,
        redirects
      );

    expect(getImplementationsResult1).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]);

    expect(getImplementationsResult2).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]);

    expect(getImplementationsResult3).toEqual([
      new Uri(implementation3Uri)
    ]);
  });

  it("interface implementations are not redirected", () => {
    const interface1Uri = "wrap://ens/some-interface1.eth";

    const implementation1Uri = "wrap://ens/some-implementation.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const redirects: UriRedirect<Uri>[] = [
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri)
      }
    ];

    const interfaces: InterfaceImplementations<Uri>[] = [
      {
        interface: new Uri(interface1Uri),
        implementations: [
          new Uri(implementation1Uri)
        ]
      }
    ];

    const getImplementationsResult = getImplementations(
        new Uri(interface1Uri),
        interfaces,
        redirects
      );

    expect(getImplementationsResult).toEqual([
      new Uri(implementation1Uri)
    ]);
  });
});
