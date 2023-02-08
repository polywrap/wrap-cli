import { ASTVisitor, FieldDefinitionNode, ObjectTypeDefinitionNode } from "graphql";
import { isModuleType } from "../abi";
import { Abi, UniqueDefKind, ResultDef, FunctionDef, ArgumentDef } from "../definitions";
import { parseAnnotateDirective, parseDirectivesInField } from "./directives";
import { VisitorBuilder } from "./types";
import { extractType } from "./utils";

export class FunctionsVisitorBuilder implements VisitorBuilder {
  constructor(protected readonly uniqueDefs: Map<string, UniqueDefKind>) { }

  private extractMethodFromFieldDefNode(node: FieldDefinitionNode): FunctionDef {
    const { map } = parseDirectivesInField(node, this.uniqueDefs);

    const resultDef: ResultDef = {
      kind: "Result",
      required: node.type.kind === "NonNullType",
      type: map ?? extractType(node.type, this.uniqueDefs)
    }

    const args: ArgumentDef[] = node.arguments?.map(inputNode => {
      if (inputNode.directives) {
        for (const dir of inputNode.directives) {
          if (dir.name.value === "annotate") {
            const map = parseAnnotateDirective(dir, this.uniqueDefs);

            return {
              kind: "Argument",
              required: inputNode.type.kind === "NonNullType",
              name: inputNode.name.value,
              type: map
            }
          }
        }
      }

      return {
        kind: "Argument",
        name: inputNode.name.value,
        required: inputNode.type.kind === "NonNullType",
        type: extractType(inputNode.type, this.uniqueDefs)
      }
    }) ?? [];

    const method: FunctionDef = {
      kind: "Function",
      result: resultDef,
      args,
      name: node.name.value
    }

    return method;
  }

  build(abi: Abi): ASTVisitor {
    return {
      enter: {
        ObjectTypeDefinition: (objectDefNode: ObjectTypeDefinitionNode) => {
          const nodeName = objectDefNode.name.value;

          if (!isModuleType(nodeName)) {
            return;
          }

          const methods = objectDefNode.fields?.map(node => this.extractMethodFromFieldDefNode(node))

          abi.functions = methods ?? []
        },
      },
    };
  }
}