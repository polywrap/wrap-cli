import {
  createModuleDefinition,
  createObjectDefinition,
  WrapAbi,
} from "@polywrap/schema-parse";

export const abi: WrapAbi = {
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
