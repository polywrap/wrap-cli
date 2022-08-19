import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  "objectTypes": [
    {
      "type": "ImportedBaseType",
      "kind": 1
    },
    {
      "type": "ImportedDerivedType",
      "kind": 1,
      "interfaces": [
        {
          "type": "ImportedBaseType",
          "kind": 2048
        }
      ]
    }
  ]
};
