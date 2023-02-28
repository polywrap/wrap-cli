import { Abi, AnyType, ArgumentDef, ArrayType, EnumDef, FunctionDef, ImportedAbi, ImportRefType, MapType, ObjectDef, PropertyDef, RefType, ResultDef, ScalarType } from "@polywrap/abi-types";

type VisitorFunction<T> = (node: T) => T | void;

// NOTE: does not visit map keys
export interface IAbiVisitor {
  Abi?: VisitorFunction<Abi | ImportedAbi>;
  Import?: VisitorFunction<ImportedAbi>;
  FunctionDef?: VisitorFunction<FunctionDef>;
  ArgumentDef?: VisitorFunction<ArgumentDef>;
  ResultDef?: VisitorFunction<ResultDef>;
  ObjectDef?: VisitorFunction<ObjectDef>;
  PropertyDef?: VisitorFunction<PropertyDef>;
  EnumDef?: VisitorFunction<EnumDef>;
  ScalarType?: VisitorFunction<ScalarType>;
  RefType?: VisitorFunction<RefType>;
  ImportRefType?: VisitorFunction<ImportRefType>;
  ArrayType?: VisitorFunction<ArrayType>;
  MapType?: VisitorFunction<MapType>;
  AnyType?: VisitorFunction<AnyType>;
}

export interface IAbiVisitorEnterAndLeave {
  enter?: IAbiVisitor;
  leave?: IAbiVisitor;
}

export class AbiVisitor implements IAbiVisitor {
  constructor(protected readonly visitor: IAbiVisitorEnterAndLeave) { }

  protected coerceVoidToUndefined<T>(value: T | void): T | undefined {
    return value === undefined ? undefined : value;
  }

  Abi(node: Abi | ImportedAbi): Abi | ImportedAbi {
    let mutatedNode = node;

    if (this.visitor.enter?.Abi) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.Abi(node)) ?? mutatedNode;
    }

    mutatedNode.imports = mutatedNode.imports?.map((importNode) => this.Import(importNode));
    mutatedNode.functions = mutatedNode.functions?.map((functionNode) => this.FunctionDef(functionNode));
    mutatedNode.objects = mutatedNode.objects?.map((objectNode) => this.ObjectDef(objectNode));
    mutatedNode.enums = mutatedNode.enums?.map((enumNode) => this.EnumDef(enumNode));

    if (this.visitor.leave?.Abi) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.Abi(node)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  Import(node: ImportedAbi): ImportedAbi {
    let mutatedNode = node;

    if (this.visitor.enter?.Import) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.Import(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.imports = mutatedNode.imports?.map((importNode) => this.Import(importNode));
    mutatedNode.functions = mutatedNode.functions?.map((functionNode) => this.FunctionDef(functionNode));
    mutatedNode.objects = mutatedNode.objects?.map((objectNode) => this.ObjectDef(objectNode));
    mutatedNode.enums = mutatedNode.enums?.map((enumNode) => this.EnumDef(enumNode));

    if (this.visitor.leave?.Import) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.Import(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  FunctionDef(node: FunctionDef): FunctionDef {
    let mutatedNode = node;

    if (this.visitor.enter?.FunctionDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.FunctionDef(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.args = mutatedNode.args?.map((argumentNode) => this.ArgumentDef(argumentNode));
    mutatedNode.result = this.ResultDef(mutatedNode.result);

    if (this.visitor.leave?.FunctionDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.FunctionDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ArgumentDef(node: ArgumentDef): ArgumentDef {
    let mutatedNode = node;

    if (this.visitor.enter?.ArgumentDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ArgumentDef(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.type = this.AnyType(mutatedNode.type);

    if (this.visitor.leave?.ArgumentDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ArgumentDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ResultDef(node: ResultDef): ResultDef {
    let mutatedNode = node;
    if (this.visitor.enter?.ResultDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ResultDef(mutatedNode)) ?? mutatedNode;
    }
    mutatedNode.type = this.AnyType(mutatedNode.type);

    if (this.visitor.leave?.ResultDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ResultDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ObjectDef(node: ObjectDef): ObjectDef {
    let mutatedNode = node;
    if (this.visitor.enter?.ObjectDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ObjectDef(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.props = mutatedNode.props?.map((propertyNode) => this.PropertyDef(propertyNode));

    if (this.visitor.leave?.ObjectDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ObjectDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  PropertyDef(node: PropertyDef): PropertyDef {
    let mutatedNode = node;

    if (this.visitor.enter?.PropertyDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.PropertyDef(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.type = this.AnyType(mutatedNode.type);
  
    if (this.visitor.leave?.PropertyDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave?.PropertyDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  EnumDef(node: EnumDef): EnumDef {
    let mutatedNode = node;

    if (this.visitor.enter?.EnumDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.EnumDef(mutatedNode)) ?? mutatedNode;
    }

    if (this.visitor.leave?.EnumDef) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.EnumDef(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  AnyType(node: AnyType): AnyType {
    let mutatedNode = node;

    if (this.visitor.enter?.AnyType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.AnyType(mutatedNode)) ?? mutatedNode;
    }

    switch (mutatedNode.kind) {
      case "Scalar":
        mutatedNode = this.ScalarType(mutatedNode);
        break;
      case "Array":
        mutatedNode = this.ArrayType(mutatedNode);
        break;
      case "Map":
        mutatedNode = this.MapType(mutatedNode);
        break;
      case "Ref":
        mutatedNode = this.RefType(mutatedNode);
        break;
      case "ImportRef":
        mutatedNode = this.ImportRefType(mutatedNode);
        break;
    }

    if (this.visitor.leave?.AnyType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.AnyType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ScalarType(node: ScalarType): ScalarType {
    let mutatedNode = node;

    if (this.visitor.enter?.ScalarType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ScalarType(mutatedNode)) ?? mutatedNode;
    }

    if (this.visitor.leave?.ScalarType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ScalarType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  RefType(node: RefType): RefType {
    let mutatedNode = node;

    if (this.visitor.enter?.RefType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.RefType(mutatedNode)) ?? mutatedNode;
    }

    if (this.visitor.leave?.RefType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.RefType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ImportRefType(node: ImportRefType): ImportRefType {
    let mutatedNode = node;
  
    if (this.visitor.enter?.ImportRefType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ImportRefType(mutatedNode)) ?? mutatedNode;
    }

    if (this.visitor.leave?.ImportRefType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ImportRefType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  ArrayType(node: ArrayType): ArrayType {
    let mutatedNode = node;
  
    if (this.visitor.enter?.ArrayType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.ArrayType(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.item.type = this.AnyType(mutatedNode.item.type);

    if (this.visitor.leave?.ArrayType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.ArrayType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  MapType(node: MapType): MapType {
    let mutatedNode = node;

    if (this.visitor.enter?.MapType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.enter.MapType(mutatedNode)) ?? mutatedNode;
    }

    mutatedNode.value.type = this.AnyType(mutatedNode.value.type);

    if (this.visitor.leave?.MapType) {
      mutatedNode = this.coerceVoidToUndefined(this.visitor.leave.MapType(mutatedNode)) ?? mutatedNode;
    }

    return mutatedNode;
  }

  visit(node: Abi | ImportedAbi) {
    this.Abi(node);
  }
}