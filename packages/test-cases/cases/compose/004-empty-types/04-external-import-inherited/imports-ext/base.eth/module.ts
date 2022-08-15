import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
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
