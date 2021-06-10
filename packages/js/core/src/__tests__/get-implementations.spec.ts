import {
  getImplementations,
  Uri,
  UriRedirect,
  Plugin,
} from "../";
import { UriInterfaceImplementations } from "../types";

describe("getImplementations", () => {
  it("works in the typical case", () => {
    const pluginImplementations: UriRedirect<Uri>[] = [
      {
        from: new Uri("authority/some-abstract-interface"),
        to: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: "",
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: [],
          },
        },
      },
      {
        from: new Uri("something/else"),
        to: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: "",
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: [new Uri("something/else-2")],
          },
        },
      },
    ];

    const implementations: UriInterfaceImplementations<Uri>[] = [
      {
        interface: new Uri("authority/some-abstract-interface"),
        implementations: [
          new Uri("one/1")
        ],
      }
    ];

    const otherRedirects: UriRedirect<Uri>[] = [
      {
        from: new Uri("some-other/other"),
        to: new Uri("other/other"),
      },
      {
        from: new Uri("some-other/other1"),
        to: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: "",
            implemented: [],
            imported: [],
          },
        },
      },
    ];

    const result = getImplementations(
      new Uri("authority/some-abstract-interface"),
      [...pluginImplementations, ...otherRedirects],
      implementations
    );

    const values = pluginImplementations.map((item) =>
      Uri.isUri(item.to) ? item.to : item.from
    ).concat(
      implementations.map(x => x.implementations)
        .reduce((s,x) =>s.concat(x), [])
    );

    expect(result).toMatchObject(values);
  });

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

    const pluginImplementations: UriRedirect<Uri>[] = [
      {
        from: new Uri(implementation4Uri),
        to: {
          factory: () => ({} as Plugin),
          manifest: {
            schema: '',
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: [new Uri("something/else-2")],
          },
        }
      }
    ];

    const implementations: UriInterfaceImplementations<Uri>[] = [
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
        [...pluginImplementations, ...redirects],
        implementations
      );
    const getImplementationsResult2 = getImplementations(
        new Uri(interface2Uri), 
        [...pluginImplementations, ...redirects],
        implementations
      );
    const getImplementationsResult3 = getImplementations(
        new Uri(interface3Uri), 
        [...pluginImplementations, ...redirects],
        implementations
      );

    expect(getImplementationsResult1).toBeTruthy();
    expect(getImplementationsResult1).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]);

    expect(getImplementationsResult2).toBeTruthy();
    expect(getImplementationsResult2).toEqual([
      new Uri(implementation1Uri),
      new Uri(implementation2Uri),
      new Uri(implementation3Uri)
    ]);

    expect(getImplementationsResult3).toBeTruthy();
    expect(getImplementationsResult3).toEqual([
      new Uri(implementation3Uri),
      new Uri(implementation4Uri)
    ]);
  });
});
