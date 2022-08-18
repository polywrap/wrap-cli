import {
  createModuleDefinition,
  createObjectDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  version: "0.1",
  objectTypes: [
    {
      ...createObjectDefinition({
        type: "CustomType",
      }),
    },
  ],
  moduleType: {
      ...createModuleDefinition({}),
    },
};
