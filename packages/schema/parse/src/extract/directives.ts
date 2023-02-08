import { DirectiveNode, FieldDefinitionNode } from "graphql";
import { MapType, UniqueDefKind } from "../definitions";
import { parseMapString } from "./utils";

export const parseDirectivesInField = (node: FieldDefinitionNode, uniqueDefs: Map<string, UniqueDefKind>) => {
  let map: MapType | undefined;

  if (node.directives) {
    for (const dir of node.directives) {
      switch (dir.name.value) {
        case "annotate":
          map = parseAnnotateDirective(dir, uniqueDefs);
          break;
      }
    }
  }

  return {
    map,
  }
}

export const parseAnnotateDirective = (node: DirectiveNode, uniqueDefs: Map<string, UniqueDefKind>): MapType => {
  const mapStringValue = node.arguments?.find((arg) => arg.name.value === "type")?.value;

  if (!mapStringValue || mapStringValue.kind !== "StringValue") {
    throw new Error(
      `Annotate directive: ${node.name.value} has invalid arguments`
    );
  }

  const mapString = mapStringValue.value;

  return parseMapString(mapString, uniqueDefs)
}
