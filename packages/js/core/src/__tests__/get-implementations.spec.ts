import {
  getImplementations,
  Uri,
  UriRedirect,
  SchemaDocument,
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
            schema: {} as SchemaDocument,
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
            schema: {} as SchemaDocument,
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
            schema: {} as SchemaDocument,
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
});
