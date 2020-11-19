import { setFirstLast } from "./utils";

type ModifyTypeMethod = (type: TypeDefinition) => TypeDefinition;

export enum NodeType {
  Generic,
  Object,
  Any,
  Scalar,
  Array,
  Property,
  Method,
  Query,
  ImportedQuery,
  ImportedObject
}

export interface TypeDefinition {
  name: string,
  type: Maybe<string>,
  required: Maybe<boolean>
  kind: NodeType
}
export function createTypeDefinition(name: string, type?: string, required?: boolean): TypeDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.Generic
  }
}

export interface ObjectTypeDefinition extends TypeDefinition {
  
}
export function createObjectTypeDefinition(name: string, type?: string, required?: boolean): ObjectTypeDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.Object
  }
}


export interface AnyTypeDefinition extends TypeDefinition {
  array: Maybe<ArrayDefinition>;
  scalar: Maybe<ScalarDefinition>;
}
export function createAnyTypeDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): AnyTypeDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: NodeType.Any
  }
}

export interface ScalarDefinition extends TypeDefinition {

}
export function createScalarDefinition(name: string, type?: string, required?: boolean): ScalarDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.Any
  }
}

export interface PropertyDefinition extends AnyTypeDefinition {
  
}
export function createPropertyDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): PropertyDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: NodeType.Property
  }
}

export interface ArrayDefinition extends AnyTypeDefinition {

}
export function createArrayDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): ArrayDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: NodeType.Array
  }
}

export interface MethodDefinition extends TypeDefinition {
  arguments: PropertyDefinition[];
  return: Maybe<PropertyDefinition>;
}

export function createMethodDefinition(name: string, type?: string, required?: boolean, args?: PropertyDefinition[], returnDef?: PropertyDefinition): MethodDefinition {
  return {
    name,
    type,
    required,
    arguments: args ? args : [],
    return: returnDef ? returnDef : null,
    kind: NodeType.Method
  }
}

export interface QueryTypeDefinition extends TypeDefinition {

}
export function createQueryTypeDefinition(name: string, type?: string, required?: boolean): QueryTypeDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.Query
  }
}

export interface ImportedQueryTypeDefinition extends QueryTypeDefinition {

}
export function createImportedQueryTypeDefinition(name: string, type?: string, required?: boolean): ImportedQueryTypeDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.ImportedQuery
  }
}

export interface ImportedObjectTypeDefinition extends ObjectTypeDefinition {

}
export function createImportedObjectTypeDefinition(name: string, type?: string, required?: boolean): ImportedObjectTypeDefinition {
  return {
    name,
    type,
    required,
    kind: NodeType.ImportedObject
  }
}

// export abstract class TypeDefinitionX {
//   constructor(
//     public name: string,
//     public type?: string,
//     public required?: boolean
//   ) { }
//   public last: boolean | null = null
//   public first: boolean | null = null

//   public finalize(modify?: ModifyTypeMethod): void { }
// }

// export class ObjectTypeDefinitionX extends TypeDefinitionX {
//   properties: PropertyDefinition[] = []

//   public finalize(modify?: ModifyTypeMethod) {
//     //setFirstLast(this.properties);

//     for (let i = 0; i < this.properties.length; ++i) {
//       this.properties[i] = modify ? modify(this.properties[i]) as PropertyDefinition : this.properties[i];
//       this.properties[i].setTypeName();
//       this.properties[i].finalize(modify);
//     }
//   }
// }

// export abstract class AnyTypeDefinitionX extends TypeDefinitionX {
//   array: ArrayDefinition | null = null
//   scalar: ScalarDefinition | null = null

//   public abstract setTypeName(): void;

//   public finalize(modify?: ModifyTypeMethod) {
//     if (this.array) {
//       this.array = modify ? modify(this.array) as ArrayDefinition : this.array;
//     }
//     if (this.scalar) {
//       this.scalar = modify ? modify(this.scalar) as ScalarDefinition : this.scalar;
//     }
//   }
// }

// export class ScalarDefinitionX extends TypeDefinitionX {
//   constructor(
//     public name: string,
//     public type: string,
//     public required?: boolean
//   ) {
//     super(name, type, required);
//   }
// }

// export class PropertyDefinitionX extends AnyTypeDefinitionX {
//   public setTypeName(): void {
//     if (this.array) {
//       this.array.setTypeName();
//       this.type = this.array.type;
//       this.required = this.array.required;
//     } else if (this.scalar) {
//       this.type = this.scalar.type;
//       this.required = this.scalar.required;
//     }
//   }
// }

// export class ArrayDefinitionX extends AnyTypeDefinition {
//   constructor(
//     public name: string,
//     public type: string,
//     public required?: boolean
//   ) {
//     super(name, type, required);
//   }

//   public get item(): TypeDefinitionX {
//     if (!this.array && !this.scalar) {
//       throw Error("Array hasn't been configured yet");
//     }

//     if (this.array) {
//       return this.array;
//     } else {
//       // @ts-ignore
//       return this.scalar;
//     }
//   }

//   public setTypeName(): void {
//     let baseTypeFound = false;
//     let array: ArrayDefinitionX = this;

//     while (!baseTypeFound) {
//       if (array.array) {
//         array = array.array;
//         array.setTypeName();
//       } else if (array.scalar) {
//         baseTypeFound = true;
//       }
//     }

//     const modifier = this.required ? "" : "?";
//     this.type = modifier + "[" + this.item.type + "]";
//   }
// }

// export class MethodDefinitionX extends TypeDefinitionX {
//   constructor(
//     public operation: "query" | "mutation",
//     name: string,
//     type?: string,
//     required?: boolean
//   ) {
//     super(name, type, required);
//   }

//   arguments: PropertyDefinition[] = []
//   return: PropertyDefinitionX | null = null;

//   public finalize(modify?: ModifyTypeMethodX) {
//     //setFirstLast(this.arguments);

//     for (let i = 0; i < this.arguments.length; ++i) {
//       this.arguments[i] = modify ? modify(this.arguments[i]) as PropertyDefinition : this.arguments[i];
//       this.arguments[i].setTypeName();
//       this.arguments[i].finalize(modify);
//     }

//     this.return?.setTypeName();
//   }
// }

// export class QueryTypeDefinitionX extends TypeDefinitionX {
//   methods: MethodDefinitionX[] = []

//   public finalize(modify?: ModifyTypeMethodX) {
//     setFirstLast(this.methods);

//     for (let i = 0; i < this.methods.length; ++i) {
//       this.methods[i] = modify ? modify(this.methods[i]) as MethodDefinition : this.methods[i];
//       this.methods[i].finalize(modify);
//     }
//   }
// }

// export class ImportedQueryTypeDefinitionX extends QueryTypeDefinitionX {
//   constructor(
//     public uri: string,
//     public namespace: string,
//     name: string,
//     type: string
//   ) {
//     super(name, type);
//   }
// }

// export class ImportedObjectTypeDefinitionX extends ObjectTypeDefinitionX {
//   constructor(
//     public uri: string,
//     public namespace: string,
//     name: string,
//     type: string
//   ) {
//     super(name, type);
//   }
// }
