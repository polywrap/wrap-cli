import { ImportedQueryTypeDefinition, QueryTypeDefinition, TypeDefinition, ObjectTypeDefinition } from ".";
import { ImportedObjectTypeDefinition } from "./definitions";
import { setFirstLast } from "./utils";

export interface TypeInfoConfig {
  extendProperties?: (t: TypeDefinition) => TypeDefinition
}

export class TypeInfo {
  userTypes: ObjectTypeDefinition[] = []
  importObjectTypes: ImportedObjectTypeDefinition[] = []
  importedQueryTypes: ImportedQueryTypeDefinition[] = []
  queryTypes: QueryTypeDefinition[] = []

  constructor(private _config?: TypeInfoConfig) { }

  public finalize() {
    const extendProperties = this._config?.extendProperties;

    setFirstLast(this.userTypes);
    for (let i = 0; i < this.userTypes.length; ++i) {
      if (extendProperties) {
        this.userTypes[i] = extendProperties(this.userTypes[i]) as ObjectTypeDefinition;
      }
      this.userTypes[i].finalize(extendProperties);
    }

    setFirstLast(this.importObjectTypes);
    for (let i = 0; i < this.importObjectTypes.length; ++i) {
      if (extendProperties) {
        this.importObjectTypes[i] = extendProperties(this.importObjectTypes[i]) as ImportedObjectTypeDefinition;
      }
      this.importObjectTypes[i].finalize(extendProperties);
    }

    setFirstLast(this.importedQueryTypes);
    for (let i = 0; i < this.importedQueryTypes.length; ++i) {
      if (extendProperties) {
        this.importedQueryTypes[i] = extendProperties(this.importedQueryTypes[i]) as ImportedQueryTypeDefinition;
      }
      this.importedQueryTypes[i].finalize(extendProperties);
    }

    setFirstLast(this.queryTypes);
    for (let i = 0; i < this.queryTypes.length; ++i) {
      if (extendProperties) {
        this.queryTypes[i] = extendProperties(this.queryTypes[i]) as QueryTypeDefinition;
      }
      this.queryTypes[i].finalize(extendProperties);
    }
  }
}
