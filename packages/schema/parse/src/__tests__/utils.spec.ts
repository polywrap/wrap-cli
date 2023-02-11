import { ArrayType, MapType } from "../definitions"
import { parseArrayString, parseMapString } from "../extract/utils"

describe("Polywrap Schema Abi Utils", () => {
  describe("parseArrayString", () => {
    it("Parses a simple array", () => {
      const arrayString = "[String!]"
      const expected: ArrayType = {
        kind: "Array",
        item: {
          required: true,
          type: {
            kind: "Scalar",
            scalar: "String"
          }
        }
      }

      const result = parseArrayString(arrayString, new Map())
      expect(result).toMatchObject(expected)
    })

    it("Parses a ref value", () => {
      const arrayString = "[Foo!]"
      const expected: ArrayType = {
        kind: "Array",
        item: {
          required: true,
          type: {
            kind: "Ref",
            ref_kind: "Enum",
            ref_name: "Foo"
          }
        }
      }

      const result = parseArrayString(arrayString, new Map([["Foo", "Enum"]]))
      expect(result).toMatchObject(expected)
    })

    it("Parses a multi-level nested array", () => {
      const arrayString = "[[[Foo!]]!]"
      const expected: ArrayType = {
        kind: "Array",
        item: {
          required: true,
          type: {
            kind: "Array",
            item: {
              required: false,
              type: {
                kind: "Array",
                item: {
                  required: true,
                  type: {
                    kind: "Ref",
                    ref_kind: "Enum",
                    ref_name: "Foo"
                  }
                }
              }
            }
          }
        }
      }

      const result = parseArrayString(arrayString, new Map([["Foo", "Enum"]]))
      expect(result).toMatchObject(expected)
    })
  })

  describe("parseMapString", () => {
    it("Without a explicitly required key", () => {
      const mapString = "Map<String, [String]!>"
      const expected: MapType = {
        kind: "Map",
        key: {
          kind: "Scalar",
          scalar: "String"
        },
        value: {
          required: true,
          type: {
            kind: "Array",
            item: {
              required: false,
              type: {
                kind: "Scalar",
                scalar: "String"
              }
            }
          }
        }
      }

      const result = parseMapString(mapString, new Map())
      expect(result).toMatchObject(expected)
    })

    it("With a explicitly required key", () => {
      const mapString = "Map<String!, [String]!>"
      const expected: MapType = {
        kind: "Map",
        key: {
          kind: "Scalar",
          scalar: "String"
        },
        value: {
          required: true,
          type: {
            kind: "Array",
            item: {
              required: false,
              type: {
                kind: "Scalar",
                scalar: "String"
              }
            }
          }
        }
      }

      const result = parseMapString(mapString, new Map())
      expect(result).toMatchObject(expected)
    })

    it("With a explicitly required key", () => {
      const mapString = "Map<String!, [String]!>"
      const expected: MapType = {
        kind: "Map",
        key: {
          kind: "Scalar",
          scalar: "String"
        },
        value: {
          required: true,
          type: {
            kind: "Array",
            item: {
              required: false,
              type: {
                kind: "Scalar",
                scalar: "String"
              }
            }
          }
        }
      }

      const result = parseMapString(mapString, new Map())
      expect(result).toMatchObject(expected)
    })

    it("Trims inner values", () => {
      const mapString = "Map<  String! ,    [String]!   >"
      const expected: MapType = {
        kind: "Map",
        key: {
          kind: "Scalar",
          scalar: "String"
        },
        value: {
          required: true,
          type: {
            kind: "Array",
            item: {
              required: false,
              type: {
                kind: "Scalar",
                scalar: "String"
              }
            }
          }
        }
      }

      const result = parseMapString(mapString, new Map())
      expect(result).toMatchObject(expected)
    })

    it("Parses a complex nested Map", () => {
      const mapString = "Map<String!, Map<String!, [Foo]!>!>"
      const expected: MapType = {
        kind: "Map",
        key: {
          kind: "Scalar",
          scalar: "String"
        },
        value: {
          required: true,
          type: {
            kind: "Map",
            key: {
              kind: "Scalar",
              scalar: "String"
            },
            value: {
              required: true,
              type: {
                kind: "Array",
                item: {
                  required: false,
                  type: {
                    kind: "Ref",
                    ref_kind: "Object",
                    ref_name: "Foo"
                  }
                }
              }
            }
          }
        }
      }

      const result = parseMapString(mapString, new Map([["Foo", "Object"]]))
      expect(result).toMatchObject(expected)
    })

    it("Throws if Map string is invalid", () => {
      const mapString = "<String!, [String]!>"
      expect(() => parseMapString(mapString, new Map())).toThrow()
    })
  })
})