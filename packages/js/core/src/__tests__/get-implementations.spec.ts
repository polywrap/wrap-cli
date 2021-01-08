import {
  getImplementations,
  Uri
} from "../";

describe("getImplementations", () => {

  it("works in the typical case", () => {
    const implementations = [
      {
        from: new Uri("authority/some-abstract-interface"),
        to: new Uri("one/1")
      },
      {
        from: /some-abstract-interface/,
        to: new Uri("two/2")
      },
      {
        from: new Uri("authority/some-abstract-interface"),
        to: {
          factory: () => ({} as any),
          manifest: {
            schema: {} as any,
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: []
          }
        }
      },
      {
        from: new Uri("something/else"),
        to: {
          factory: () => ({} as any),
          manifest: {
            schema: {} as any,
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: [new Uri("something/else-2")]
          }
        }
      },
      {
        from: /another\/one/,
        to: {
          factory: () => ({} as any),
          manifest: {
            schema: {} as any,
            implemented: [new Uri("authority/some-abstract-interface")],
            imported: []
          }
        }
      },
    ];

    const others = [
      {
        from: new Uri("some-other/other"),
        to: new Uri("other/other")
      },
      {
        from: /somee-abstract-interface/,
        to: new Uri("two/22")
      },
      {
        from: new Uri("some-other/other1"),
        to: {
          factory: () => ({} as any),
          manifest: {
            schema: {} as any,
            implemented: [],
            imported: []
          }
        }
      },
    ]

    const result = getImplementations(
      new Uri("authority/some-abstract-interface"),
      [
        ...implementations,
        ...others
      ]
    );

    const values = implementations.map((item) => item.to);
    expect(result).toMatchObject(values);
  });
});
