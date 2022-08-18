import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  "objectTypes": [
    {
      "type": "ExternalType",
      "kind": 1,
      "properties": [
        {
          "type": "String",
          "name": "str",
          "kind": 34,
          "scalar": {
            "type": "String",
            "name": "str",
            "kind": 4
          }
        }
      ],
      "interfaces": []
    }
  ]
};
