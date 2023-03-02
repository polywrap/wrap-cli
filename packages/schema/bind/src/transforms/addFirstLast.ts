import { Abi, EnumDef, FunctionDef, ImportedAbi, ObjectDef } from "@polywrap/abi-types";
import { IAbiVisitorEnterAndLeave } from "@polywrap/schema-abi";

const addFirstLastProps = <T>(items: T[]): T[] => {
  return items.map((item, index) => {
    const isFirst = index === 0;
    const isLast = index === items.length - 1;

    return {
      ...item,
      isFirst,
      isLast,
    };
  });
}

export const addFirstLast: IAbiVisitorEnterAndLeave = {
  enter: {
    Abi: (abi: Abi): Abi => {
      if (abi.functions) {
        abi.functions = addFirstLastProps(abi.functions);
      }
  
      if (abi.objects) {
        abi.objects = addFirstLastProps(abi.objects);
      }
  
      if (abi.enums) {
        abi.enums = addFirstLastProps(abi.enums);
      }
  
      if (abi.imports) {
        abi.imports = addFirstLastProps(abi.imports);
      }
  
      return abi;
    },
    Import: (abi: ImportedAbi): ImportedAbi => {
      if (abi.functions) {
        abi.functions = addFirstLastProps(abi.functions);
      }
  
      if (abi.objects) {
        abi.objects = addFirstLastProps(abi.objects);
      }
  
      if (abi.enums) {
        abi.enums = addFirstLastProps(abi.enums);
      }
  
      if (abi.imports) {
        abi.imports = addFirstLastProps(abi.imports);
      }
  
      return abi;
    },
    ObjectDef: (objectDef: ObjectDef): ObjectDef => {
      if (objectDef.props) {
        objectDef.props = addFirstLastProps(objectDef.props);
      }
  
      return objectDef;
    },
    EnumDef: (enumDef: EnumDef): EnumDef => {
      if (enumDef.constants) {
        enumDef.constants = addFirstLastProps(enumDef.constants);
      }
  
      return enumDef;
    },
    FunctionDef: (functionDef: FunctionDef): FunctionDef => {
      if (functionDef.args) {
        functionDef.args = addFirstLastProps(functionDef.args);
      }
  
      return functionDef;
    }
  }
}