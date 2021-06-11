import {
  getImplementations,
  Uri,
  UriRedirect,
  Plugin,
} from "../";
import { InterfaceImplementations, PluginRegistration } from "../types";

describe("getImplementations", () => {

  it("works with complex redirects", () => {
    const interface1Uri = "w3://ens/some-interface1.eth";
    const interface2Uri = "w3://ens/some-interface2.eth";
    const interface3Uri = "w3://ens/some-interface3.eth";

    const implementation1Uri = "w3://ens/some-implementation.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";
    const implementation3Uri = "w3://ens/some-implementation3.eth";
    const implementation4Uri = "w3://ens/some-implementation4.eth";

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

    const plugins: PluginRegistration<Uri>[] = [
      {
        uri: new Uri(implementation4Uri),
        plugin: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: '',
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: [new Uri("something/else-2")],
          },
        }
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
          new Uri(implementation3Uri),
          new Uri(implementation4Uri)
        ]
      }
    ];

    const getImplementationsResult1 = getImplementations(
        new Uri(interface1Uri), 
        redirects,
        plugins,
        interfaces
      );
    const getImplementationsResult2 = getImplementations(
        new Uri(interface2Uri), 
        redirects,
        plugins,
        interfaces
      );
    const getImplementationsResult3 = getImplementations(
        new Uri(interface3Uri), 
        redirects,
        plugins,
        interfaces
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
      new Uri(implementation3Uri),
      new Uri(implementation4Uri)
    ]);
  });

  it("interface implementations are not redirected", () => {
    const interface1Uri = "w3://ens/some-interface1.eth";

    const implementation1Uri = "w3://ens/some-implementation.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

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
        redirects,
        [],
        interfaces
      );
  
    expect(getImplementationsResult).toEqual([
      new Uri(implementation1Uri)
    ]);
  });

  it("do not return plugins that are not explicitly registered", () => {
    const interfaceUri = "w3://ens/some-interface.eth";

    const implementation1Uri = "w3://ens/some-implementation1.eth";
    const implementation2Uri = "w3://ens/some-implementation2.eth";

    const plugins: PluginRegistration<Uri>[] = [
      {
        uri: new Uri(implementation1Uri),
        plugin: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: '',
            implemented: [new Uri(interfaceUri)],
            imported: [],
          }
        }
      }
    ];

    const interfaces: InterfaceImplementations<Uri>[] = [
      {
        interface: new Uri(interfaceUri),
        implementations: [
          new Uri(implementation2Uri)
        ]
      }
    ];

    const getImplementationsResult = getImplementations(
        new Uri(interfaceUri),
        [], 
        plugins,
        interfaces
      );
  
    expect(getImplementationsResult).toEqual([
      new Uri(implementation2Uri)
    ]);
  });
});
