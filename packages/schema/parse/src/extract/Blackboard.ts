import {
  DocumentNode,
  visit,
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
} from "graphql";

export interface CustomType {
  name: string;
  type: "enum" | "object";
}

export class Blackboard {
  private _customTypes?: CustomType[];

  constructor(private _astNode: DocumentNode) {}

  getCustomTypes(): CustomType[] {
    if (this._customTypes) {
      return this._customTypes;
    }

    const customTypes: CustomType[] = [];

    visit(this._astNode, {
      enter: {
        ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
          customTypes.push({
            name: node.name.value,
            type: "object",
          });
        },
        EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
          customTypes.push({
            name: node.name.value,
            type: "enum",
          });
        },
      },
    });

    this._customTypes = customTypes;
    return this._customTypes;
  }
}
