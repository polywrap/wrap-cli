import { AbiTransforms } from "@polywrap/schema-parse";
import { EnumDefinition } from "@polywrap/wrap-manifest-types-js";

export const addEnumMembers: AbiTransforms = {
  enter: {
    EnumDefinition: (def: EnumDefinition): EnumDefinition => {
      if (!def.constants) {
        return { ...def };
      }

      const members: Array<Record<string, unknown>> = [];
      let value = 0;

      for (const constant of def.constants) {
        members.push({
          name: constant,
          value: value,
        });
        value += 1;
      }

      return {
        ...def,
        members,
      } as EnumDefinition;
    },
  },
};
