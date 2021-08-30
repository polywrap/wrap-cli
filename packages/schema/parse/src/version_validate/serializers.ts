import { GenericDefinition, EnumDefinition } from "../typeInfo";

export function stringifyGenericTypes(value: GenericDefinition): string {
  return JSON.stringify([value.type, value.name, value.required, value.kind]);
}

export function stringifyGenericSet(arr: GenericDefinition[]): Set<string> {
  return new Set(arr.map((x) => stringifyGenericTypes(x)));
}

export function stringifyEnumTypes(enumDefs: EnumDefinition[]): Set<string> {
  let enumSets: Set<string> = new Set<string>();
  for (let i = 0; i < enumDefs.length; i++) {
    let enumStr: string = JSON.stringify({
      generics: stringifyGenericTypes(enumDefs[i]),
      constants: enumDefs[i].constants.sort(),
    });
    enumSets.add(enumStr);
  }
  return enumSets;
}
