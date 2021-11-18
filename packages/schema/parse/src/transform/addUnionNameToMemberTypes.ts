import { TypeInfoTransforms } from ".";
import {
  TypeInfo,
  UnionDefinition,
  ImportedUnionDefinition,
} from "../typeInfo";

export const setMemberTypeParentUnionNames: TypeInfoTransforms = {
  enter: {
    UnionDefinition: (def: UnionDefinition): UnionDefinition => {
      return {
        ...def,
        memberTypes: def.memberTypes
          ? def.memberTypes.map(setMemberTypeParentUnionName)
          : null,
      };
    },
    ImportedUnionDefinition: (
      def: ImportedUnionDefinition
    ): ImportedUnionDefinition => {
      return {
        ...def,
        memberTypes: def.memberTypes
          ? def.memberTypes.map(setMemberTypeParentUnionName)
          : null,
      };
    },
    TypeInfo: (typeInfo: TypeInfo): TypeInfo => ({
      ...typeInfo,
      unionTypes: typeInfo.unionTypes.map(setMemberTypeParentUnionName),
      importedUnionTypes: typeInfo.importedUnionTypes.map(
        setMemberTypeParentUnionName
      ) as ImportedUnionDefinition[],
    }),
  },
};

function setMemberTypeParentUnionName(
  union: UnionDefinition | ImportedUnionDefinition
): UnionDefinition | ImportedUnionDefinition {
  return {
    ...union,
    memberTypes: union.memberTypes
      ? union.memberTypes.map((memberType) => ({
          ...memberType,
          union: union.type,
        }))
      : null,
  };
}
