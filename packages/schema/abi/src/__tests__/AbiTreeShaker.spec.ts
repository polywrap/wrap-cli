import { Abi } from "@polywrap/abi-types";
import { AbiTreeShaker } from "..";
import { AbiMerger } from "../AbiMerger";
import { AbiSanitizer } from "../AbiSanitizer";

describe("AbiTreeShaker", () => {
  it("Shakes local definitions based on needed types list", async () => {
    const merger = new AbiMerger();
    const abiTreeShaker = new AbiTreeShaker(merger);
    
    const abi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Foo",
          props: [
            {
              kind: "Property",
              required: true,
              name: "bar",
              type: {
                kind: "Ref",
                ref_name: "Bar",
                ref_kind: "Enum"
              }
            }
          ]
        },
        {
          kind: "Object",
          name: "Baz",
          props: [
            {
              kind: "Property",
              name: "bar",
              required: true,
              type: {
                kind: "Scalar",
                scalar: "String"
              }
            }
          ]
        }
      ],
      enums: [
        {
          kind: "Enum",
          name: "Bar",
          constants: ["ONE", "TWO"]
        },
        {
          kind: "Enum",
          name: "Some",
          constants: ["ONE", "TWO"]
        }
      ]
    }

    const shakenAbi = abiTreeShaker.shakeTree(abi, ["Foo"])
    const expectedAbi: Abi = {
      version: "0.2",
      objects: [{
        kind: "Object",
        name: "Foo",
        props: [
          {
            kind: "Property",
            required: true,
            name: "bar",
            type: {
              kind: "Ref",
              ref_name: "Bar",
              ref_kind: "Enum"
            }
          }
        ]
      }],
      enums: [{
        kind: "Enum",
        name: "Bar",
        constants: ["ONE", "TWO"]
      }]
    }
    const sanitizer = new AbiSanitizer();
    expect(sanitizer.sanitizeAbi(shakenAbi)).toEqual(expectedAbi)
  })

  it("Shakes unneeded definitions from imported abis", async () => {
    const merger = new AbiMerger();
    const abiTreeShaker = new AbiTreeShaker(merger);

    const abi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Foo",
          props: [
            {
              kind: "Property",
              required: true,
              name: "bar",
              type: {
                kind: "ImportRef",
                ref_name: "Bar",
                ref_kind: "Enum",
                import_id: "2.1"
              }
            },
            {
              kind: "Property",
              required: true,
              name: "baz",
              type: {
                kind: "ImportRef",
                ref_name: "Baz",
                ref_kind: "Enum",
                import_id: "2"
              }
            }
          ]
        }
      ],
      imports: [
        {
          namespace: "EXT2",
          uri: "uri2",
          id: "2",
          type: "wasm",
          objects: [
            {
              kind: "Object",
              name: "BazObj",
              props: [
                {
                  kind: "Property",
                  required: true,
                  name: "bar",
                  type: {
                    kind: "Scalar",
                    scalar: "String"
                  }
                }
              ]
            }
          ],
          enums: [
            {
              kind: "Enum",
              name: "Baz",
              constants: ["ONE", "TWO"]
            },
            {
              kind: "Enum",
              name: "BazEnum",
              constants: ["ONE", "TWO"]
            }
          ],
          imports: [
            {
              namespace: "EXT1",
              uri: "uri1",
              id: "1",
              type: "wasm",
              objects: [
                {
                  kind: "Object",
                  name: "SomeObj",
                  props: [
                    {
                      kind: "Property",
                      required: true,
                      name: "bar",
                      type: {
                        kind: "Scalar",
                        scalar: "String"
                      }
                    }
                  ]
                }
              ],
              enums: [
                {
                  kind: "Enum",
                  name: "Bar",
                  constants: ["ONE", "TWO"]
                }
              ]
            }
          ]
        }
      ]
    }

    const expectedAbi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "Foo",
          props: [
            {
              kind: "Property",
              required: true,
              name: "bar",
              type: {
                kind: "ImportRef",
                ref_name: "Bar",
                ref_kind: "Enum",
                import_id: "2.1"
              }
            },
            {
              kind: "Property",
              required: true,
              name: "baz",
              type: {
                kind: "ImportRef",
                ref_name: "Baz",
                ref_kind: "Enum",
                import_id: "2"
              }
            }
          ]
        }
      ],
      imports: [
        {
          namespace: "EXT2",
          uri: "uri2",
          id: "2",
          type: "wasm",
          enums: [
            {
              kind: "Enum",
              name: "Baz",
              constants: ["ONE", "TWO"]
            },
          ],
          imports: [
            {
              namespace: "EXT1",
              uri: "uri1",
              id: "1",
              type: "wasm",
              enums: [
                {
                  kind: "Enum",
                  name: "Bar",
                  constants: ["ONE", "TWO"]
                }
              ]
            }
          ]
        }
      ]
    }

    const shakenAbi = abiTreeShaker.shakeImports(abi)
    const sanitizer = new AbiSanitizer();
    expect(sanitizer.sanitizeAbi(shakenAbi)).toEqual(expectedAbi)
  });
})