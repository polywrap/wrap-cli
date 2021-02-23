import {
  DocumentNode,
  visit,
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode
} from "graphql";

export interface CustomType {
  name: string;
  type: "enum" | "object";
}

export class Blackboard {

  private _namedTypes?: CustomType[];

  constructor(private _astNode: DocumentNode) {}

  getCustomTypes(): CustomType[] {
    if (this._namedTypes) {
      return this._namedTypes;
    }

    const namedTypes: CustomType[] = [];

    visit(this._astNode, {
      enter: {
        ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
          namedTypes.push({
            name: node.name.value,
            type: "object"
          });
        },
        EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
          namedTypes.push({
            name: node.name.value,
            type: "enum"
          });
        },
      }
    });

    this._namedTypes = namedTypes;
    return this._namedTypes;
  }
}
