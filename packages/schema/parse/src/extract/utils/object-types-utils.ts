import {
  FieldDefinitionNode,
  NamedTypeNode,
  StringValueNode
} from "graphql";
import {
  createArrayDefinition,
  createPropertyDefinition,
  GenericDefinition,
  MapDefinition,
  ObjectDefinition,
  PropertyDefinition
} from "../../typeInfo";
import { parseMapType } from "./map-utils";
import { setPropertyType } from "./property-utils";


export interface State {
  currentType?: ObjectDefinition;
  currentProperty?: PropertyDefinition | undefined;
  nonNullType?: boolean;
  // currentMapDirective?: {
  //   keyType: string;
  //   valueType: string;
  // };
}

// export function extractMapDirective(node: DirectiveNode, state: State): void {
//   if (!node.arguments || node.arguments.length !== 2) {
//     throw new Error(`Invalid map directive: ${node.name.value}`);
//   }

//   let keyType: string | undefined;
//   let valueType: string | undefined;

//   for (const arg of node.arguments) {
//     const dirName = arg.name.value;
//     const dirValue = (arg.value as StringValueNode).value;

//     switch (dirName) {
//       case "key": {
//         if (!isMapKeyType(dirValue)) {
//           throw new Error(
//             `Map directive: ${node.name.value} has invalid key type: ${dirValue}`
//           );
//         }
//         keyType = dirValue;
//         break;
//       }
//       case "value": {
//         valueType = dirValue;
//         break;
//       }
//     }
//     if(!keyType || !valueType) {
//       throw new Error(`Map directive: ${node.name.value} has invalid arguments`);
//     }

//     state.currentMapDirective = {
//       keyType: keyType as string,
//       valueType: valueType as string,
//     }
//   }
// }

export function extractFieldDefinition(
  node: FieldDefinitionNode,
  state: State
): void {
  const importDef = state.currentType;
  let mapType: string | undefined;
  let mapDef: GenericDefinition | undefined;

  if (node.directives) {
    for (const dir of node.directives) {
      switch (dir.name.value) {
        case "map": {
          mapType = (dir.arguments?.find((arg) => arg.name.value === "type")?.value as StringValueNode).value ;
          if (!mapType) {
            throw new Error(
              `Map directive: ${node.name.value} has invalid arguments`
            );
          }
          mapDef = parseMapType(mapType);
          break;
        }
        default:
          throw new Error(`Unknown directive ${dir.name.value}`);
      }
    }
  }

  if (!importDef) {
    return;
  }

  if (node.arguments && node.arguments.length > 0) {
    throw Error(
      `Imported types cannot have methods. See type "${importDef.name}"`
    );
  }

  const property = createPropertyDefinition({
    type: mapType ? mapType : "N/A",
    name: node.name.value,
    map: mapDef ? {...mapDef, name: node.name.value } as MapDefinition : undefined,
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
