import {
  createArrayDefinition,
  createPropertyDefinition,
  GenericDefinition,
  MapDefinition,
  ObjectDefinition,
  PropertyDefinition,
} from "../../typeInfo";
import { parseMapType } from "./map-utils";
import { setPropertyType } from "./property-utils";

import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  NamedTypeNode,
  StringValueNode,
} from "graphql";

export interface State {
  currentType?: ObjectDefinition;
  currentProperty?: PropertyDefinition | undefined;
  nonNullType?: boolean;
}

export interface AnnotatedDefinition {
  type?: string;
  def?: GenericDefinition;
}

export function extractAnnotateDirective(
  node: FieldDefinitionNode | InputValueDefinitionNode
): AnnotatedDefinition {
  let type: string | undefined;
  let def: GenericDefinition | undefined;

  if (node.directives) {
    for (const dir of node.directives) {
      switch (dir.name.value) {
        case "annotate": {
          type = (dir.arguments?.find((arg) => arg.name.value === "type")
            ?.value as StringValueNode).value;
          if (!type) {
            throw new Error(
              `Annotate directive: ${node.name.value} has invalid arguments`
            );
          }
          def = parseMapType(type);
          break;
        }
        default:
          throw new Error(`Unknown directive ${dir.name.value}`);
      }
    }
  }

  return { type, def };
}

export function extractFieldDefinition(
  node: FieldDefinitionNode,
  state: State
): void {
  const importDef = state.currentType;

  if (!importDef) {
    return;
  }

  if (node.arguments && node.arguments.length > 0) {
    throw Error(
      `Imported types cannot have methods. See type "${importDef.name}"`
    );
  }

  const { type, def } = extractAnnotateDirective(node);

  const property = createPropertyDefinition({
    type: type ? type : "N/A",
    name: node.name.value,
    map: def ? ({ ...def, name: node.name.value } as MapDefinition) : undefined,
    comment: node.description?.value,
  });

  state.currentProperty = property;
  importDef.properties.push(property);
}

export function extractNamedType(node: NamedTypeNode, state: State): void {
  const property = state.currentProperty;

  if (!property) {
    return;
  }

  if (property.scalar) {
    return;
  }

  if (!property.name) {
    throw Error(
      "extractNamedType: Invalid state. Uninitialized currentProperty, name not found.\n" +
        `Method: ${JSON.stringify(property, null, 2)}\nState: ${JSON.stringify(
          state,
          null,
          2
        )}`
    );
  }

  setPropertyType(property, property.name, {
    type: node.name.value,
    required: state.nonNullType,
  });

  state.nonNullType = false;
}

export function extractListType(state: State): void {
  const property = state.currentProperty;

  if (!property) {
    return;
  }

  if (property.scalar) {
    return;
  }

  property.array = createArrayDefinition({
    name: property.name,
    type: "N/A",
    required: state.nonNullType,
  });
  state.currentProperty = property.array;
  state.nonNullType = false;
}
