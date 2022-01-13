import { createObjectDefinition, createPropertyDefinition } from "@web3api/schema-parse";
import { checkDuplicateEnvProperties } from "../resolve";

describe("Check duplicate environment properties", () => {
  it("should throw error if duplicate property found", () => {
    try {
      checkDuplicateEnvProperties(
        createObjectDefinition({
          type: "QueryEnv",
          properties: [
            createPropertyDefinition({
              type: "String",
              name: "prop"
            })
          ]
        }),
        [
          createPropertyDefinition({
            type: "Int",
            name: "prop"
          })
        ]
      );

      fail("Error not thrown");
    } catch (error) {
      expect(error.message).toEqual(
        "Type 'QueryEnv' contains duplicate property 'prop' of type 'Env'"
      )
    }
  });

  it("should do nothing if no duplicate properties found", () => {
    checkDuplicateEnvProperties(
      createObjectDefinition({
        type: "QueryEnv",
        properties: [
          createPropertyDefinition({
            type: "String",
            name: "prop"
          })
        ]
      }),
      [
        createPropertyDefinition({
          type: "Int",
          name: "prop2"
        })
      ]
    );
  });
});
