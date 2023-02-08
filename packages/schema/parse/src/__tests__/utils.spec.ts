import { MapType } from "../definitions"
import { parseMapString } from "../extract/utils"

describe("Polywrap Schema Abi Utils", () => {
  it("parseMapString", () => {
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
})