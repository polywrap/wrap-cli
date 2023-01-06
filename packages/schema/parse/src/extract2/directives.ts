import { DirectiveNode, FieldDefinitionNode } from "graphql";
import { MapType, UniqueDefKind } from "../definitions";
import { parseMapString } from "../extract/utils/map-utils";
import { EnvDirDefinition } from "../extract/utils/module-types-utils";

export const parseDirectivesInField = (node: FieldDefinitionNode, uniqueDefs: Map<string, UniqueDefKind>) => {
  let map: MapType | undefined;
  let env: EnvDirDefinition | undefined;

  if (node.directives) {
    for (const dir of node.directives) {
      switch (dir.name.value) {
        case "annotate":
          map = parseAnnotateDirective(dir, uniqueDefs);
          break;

        case "env":
          env = parseEnvDirective(dir)
      }
    }
  }

  return {
    map,
    env
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

export function parseEnvDirective(
  node: DirectiveNode
): EnvDirDefinition {
  const requiredValue = node.arguments?.find(
    (arg) => arg.name.value === "required"
  )?.value;

  if (!requiredValue || requiredValue.kind !== "BooleanValue") {
    throw new Error(
      `Env directive: ${node.name.value} has invalid arguments`
    );
  }

  const required = requiredValue.value;

  return {
    required,
  };
}