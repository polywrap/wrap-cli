import { Abi } from "@polywrap/abi-types";
import { LinkerVisitor } from "../LinkerVisitor"

describe("LinkerVisitor", () => {
  it("Mutates unlinked import references into import references", () => {
    const abi: Abi = {
      version: "0.2",
      objects: [
        {
          kind: "Object",
          name: "TestObject",
          props: [
            {
              kind: "Property",
              name: "testProperty",
              required: true,
              type: {
                kind: "UnlinkedImportRef",
                namespaced_ref_name: "TestEnum"
              }
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
          name: "TestObject",
          props: [
            {
              kind: "Property",
              name: "testProperty",
              required: true,
              type: {
                kind: "ImportRef",
                ref_name: "TestEnum",
                ref_kind: "Enum",
                import_id: "0"
              }
            }
          ]
        }
      ]
    }

    const visitor = new LinkerVisitor({
      enter: {
        UnlinkedImportRefType: (unlinkedRefType) => {
          return {
            kind: "ImportRef",
            ref_name: unlinkedRefType.namespaced_ref_name,
            ref_kind: "Enum",
            import_id: "0"
          }
        }
      }
    });

    visitor.visit(abi)

    expect(abi).toEqual(expectedAbi)
  })
})