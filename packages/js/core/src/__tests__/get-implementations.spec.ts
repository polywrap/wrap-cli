import {
  getImplementations,
  Uri,
  UriRedirect,
  SchemaDocument,
  Plugin,
} from "../";

describe("getImplementations", () => {
  it("works in the typical case", () => {
    const implementations: UriRedirect[] = [
      {
        from: new Uri("authority/some-abstract-interface"),
        to: new Uri("one/1"),
      },
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

    const others: UriRedirect[] = [
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
      [...implementations, ...others]
    );

    const values = implementations.map((item) =>
      Uri.isUri(item.to) ? item.to : item.from
    );
    expect(result).toMatchObject(values);
  });
});
