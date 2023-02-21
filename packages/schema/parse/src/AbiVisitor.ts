import { Abi, AnyType, ArgumentDef, ArrayType, EnumDef, FunctionDef, ImportedAbi, ImportRefType, MapType, ObjectDef, PropertyDef, RefType, ResultDef, ScalarType } from "./definitions";

export interface IAbiVisitor {
  Abi?: (node: Abi) => void;
  Imports?: (node: ImportedAbi[]) => void;
  Import?: (node: ImportedAbi) => void;
  FunctionDef?: (node: FunctionDef) => void;
  ArgumentDef?: (node: ArgumentDef) => void;
  ResultDef?: (node: ResultDef) => void;
  ObjectDef?: (node: ObjectDef) => void;
  PropertyDef?: (node: PropertyDef) => void;
  EnumDef?: (node: EnumDef) => void;
  ScalarType?: (node: ScalarType) => void;
  RefType?: (node: RefType) => void;
  ImportRefType?: (node: ImportRefType) => void;
  ArrayType?: (node: ArrayType) => void;
  MapType?: (node: MapType) => void;
  AnyType?: (node: AnyType) => void;
}

interface IAbiVisitorEnterAndLeave {
  enter?: IAbiVisitor;
  leave?: IAbiVisitor;
}

export class AbiVisitor implements IAbiVisitor {
  constructor(private readonly visitor: IAbiVisitorEnterAndLeave) { }

  Abi(node: Abi) {
    if (this.visitor.enter?.Abi) {
      this.visitor.enter.Abi(node);
    }

    if (node.imports) {
      this.Imports(node.imports);
    }

    if (node.functions) {
      for (const functionNode of node.functions) {
        this.FunctionDef(functionNode);
      }
    }

    if (node.objects) {
      for (const objectNode of node.objects) {
        this.ObjectDef(objectNode);
      }
    }

    if (node.enums) {
      for (const enumNode of node.enums) {
        this.EnumDef(enumNode);
      }
    }

    if (this.visitor.leave?.Abi) {
      this.visitor.leave.Abi(node);
    }
  }

  Imports(node: ImportedAbi[]) {
    if (this.visitor.enter?.Imports) {
      this.visitor.enter.Imports(node);
    }

    for (const importNode of node) {
      this.Import(importNode);
    }

    if (this.visitor.leave?.Imports) {
      this.visitor.leave.Imports(node);
    }
  }

  Import(node: ImportedAbi) {
    if (this.visitor.enter?.Import) {
      this.visitor.enter.Import(node);
    }

    this.Abi({
      version: "0.2",
      ...node
    });

    if (this.visitor.leave?.Import) {
      this.visitor.leave.Import(node);
    }
  }

  FunctionDef(node: FunctionDef) {
    if (this.visitor.enter?.FunctionDef) {
      this.visitor.enter.FunctionDef(node);
    }

    if (node.args) {
      for (const argumentNode of node.args) {
        this.ArgumentDef(argumentNode);
      }
    }

    this.ResultDef(node.result);

    if (this.visitor.leave?.FunctionDef) {
      this.visitor.leave.FunctionDef(node);
    }
  }

  ArgumentDef(node: ArgumentDef) {
    if (this.visitor.enter?.ArgumentDef) {
      this.visitor.enter.ArgumentDef(node);
    }
    this.AnyType(node.type);

    if (this.visitor.leave?.ArgumentDef) {
      this.visitor.leave.ArgumentDef(node);
    }
  }

  ResultDef(node: ResultDef) {
    if (this.visitor.enter?.ResultDef) {
      this.visitor.enter.ResultDef(node);
    }
    this.AnyType(node.type);

    if (this.visitor.leave?.ResultDef) {
      this.visitor.leave.ResultDef(node);
    }
  }

  ObjectDef(node: ObjectDef) {
    if (this.visitor.enter?.ObjectDef) {
      this.visitor.enter.ObjectDef(node);
    }
    if (node.props) {
      for (const propertyNode of node.props) {
        this.PropertyDef(propertyNode);
      }
    }
    if (this.visitor.leave?.ObjectDef) {
      this.visitor.leave.ObjectDef(node);
    }
  }

  PropertyDef(node: PropertyDef) {
    if (this.visitor.enter?.PropertyDef) {
      this.visitor.enter.PropertyDef(node);
    }
    this.AnyType(node.type);
    if (this.visitor.leave?.PropertyDef) {
      this.visitor.leave?.PropertyDef(node);
    }
  }

  EnumDef(node: EnumDef) {
    if (this.visitor.enter?.EnumDef) {
      this.visitor.enter.EnumDef(node);
    }

    if (this.visitor.leave?.EnumDef) {
      this.visitor.leave.EnumDef(node);
    }
  }

  AnyType(node: AnyType) {
    if (this.visitor.enter?.AnyType) {
      this.visitor.enter.AnyType(node);
    }

    switch (node.kind) {
      case "Scalar":
        this.ScalarType(node);
        break;
      case "Array":
        this.ArrayType(node);
        break;
      case "Map":
        this.MapType(node);
        break;
      case "Ref":
        this.RefType(node);
        break;
      case "ImportRef":
        this.ImportRefType(node);
        break;
    }

    if (this.visitor.leave?.AnyType) {
      this.visitor.leave.AnyType(node);
    }
  }

  ScalarType(node: ScalarType) {
    if (this.visitor.enter?.ScalarType) {
      this.visitor.enter.ScalarType(node);
    }

    if (this.visitor.leave?.ScalarType) {
      this.visitor.leave.ScalarType(node);
    }
  }

  RefType(node: RefType) {
    if (this.visitor.enter?.RefType) {
      this.visitor.enter.RefType(node);
    }

    if (this.visitor.leave?.RefType) {
      this.visitor.leave.RefType(node);
    }
  }

  ImportRefType(node: ImportRefType) {
    if (this.visitor.enter?.ImportRefType) {
      this.visitor.enter.ImportRefType(node);
    }

    if (this.visitor.leave?.ImportRefType) {
      this.visitor.leave.ImportRefType(node);
    }
  }

  ArrayType(node: ArrayType) {
    if (this.visitor.enter?.ArrayType) {
      this.visitor.enter.ArrayType(node);
    }
    this.AnyType(node.item.type);

    if (this.visitor.leave?.ArrayType) {
      this.visitor.leave.ArrayType(node);
    }
  }

  MapType(node: MapType) {
    if (this.visitor.enter?.MapType) {
      this.visitor.enter.MapType(node);
    }
    this.AnyType(node.value.type);

    if (this.visitor.leave?.MapType) {
      this.visitor.leave.MapType(node);
    }
  }

  visit(node: Abi) {
    this.Abi(node);
  }
}