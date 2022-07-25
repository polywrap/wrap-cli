import {
  createArrayDefinition,
  createPropertyDefinition
} from "../../abi";
import { parseMapType } from "./map-utils";
import { setPropertyType } from "./property-utils";

import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  NamedTypeNode,
  StringValueNode,
} from "graphql";
import {
  GenericDefinition,
  MapDefinition,
  ObjectDefinition,
  PropertyDefinition
} from "@polywrap/wrap-manifest-types-js";

export interface State {
  currentType?: ObjectDefinition;
  currentProperty?: PropertyDefinition;
  nonNullType?: boolean;
}

export interface AnnotatedDefinition {
  type?: string;
  def?: GenericDefinition;
}

export function extractAnnotateDirective(
  node: FieldDefinitionNode | InputValueDefinitionNode,
  name: string
): AnnotatedDefinition {
  let type: string | undefined;
  let def: GenericDefinition | undefined;

  if (node.directives) {
    for (const dir of node.directives) {
      if (dir.name.value === "annotate") {
        type = (dir.arguments?.find((arg) => arg.name.value === "type")
          ?.value as StringValueNode).value;
        if (!type) {
          throw new Error(
            `Annotate directive: ${node.name.value} has invalid arguments`
          );
        }
        def = parseMapType(type, name);
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

  const name = node.name.value;
  const { type, def } = extractAnnotateDirective(node, name);

  const property = createPropertyDefinition({
    type: type ? type : "N/A",
    name: name,
    map: def ? (def as MapDefinition) : undefined,
    comment: node.description?.value,
    required: !!(def && def.required),
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
