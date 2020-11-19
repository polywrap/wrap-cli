import {
  GenericDefinition,
  ObjectDefinition,
  AnyDefinition,
  ScalarDefinition,
  PropertyDefinition,
  ArrayDefinition,
  MethodDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition
} from "./definitions";

export interface TypeInfoVisitor {
  GenericDefinition?:
    (def: GenericDefinition) => GenericDefinition;
  ObjectDefinition?:
    (def: ObjectDefinition) => ObjectDefinition;
  AnyDefinition?:
    (def: AnyDefinition) => AnyDefinition;
  ScalarDefinition?:
    (def: ScalarDefinition) => ScalarDefinition;
  PropertyDefinition?:
    (def: PropertyDefinition) => PropertyDefinition;
  ArrayDefinition?:
    (def: ArrayDefinition) => ArrayDefinition;
  MethodDefinition?:
    (def: MethodDefinition) => MethodDefinition;
  QueryDefinition?:
    (def: QueryDefinition) => QueryDefinition;
  ImportedQueryDefinition?:
    (def: ImportedQueryDefinition) => ImportedQueryDefinition;
  ImportedObjectDefinition?:
    (def: ImportedObjectDefinition) => ImportedObjectDefinition;
}
