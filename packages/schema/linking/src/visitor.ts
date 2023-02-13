import { Abi, ImportedAbi, FunctionDef, ArgumentDef, ResultDef, ObjectDef, PropertyDef, EnumDef, ScalarType, RefType, ImportRefType, ArrayType, MapType, AnyType } from "@polywrap/schema-parse/build/definitions";

interface IAbiVisitor {
  Abi?: (node: Abi) => void;
  ImportedAbi?: (node: ImportedAbi) => void;
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

export class AbiVisitor {
  constructor(private readonly visitor: IAbiVisitor) {}

  private _Abi(node: Abi) {
    if (this.visitor.Abi) {
      this.visitor.Abi(node);
    }

    if (node.imports) {
      for (const importNode of node.imports) {
        this._ImportedAbi(importNode);
      }
    }

    if (node.functions) {
      for (const functionNode of node.functions) {
        this._FunctionDef(functionNode);
      }
    }

    if (node.objects) {
      for (const objectNode of node.objects) {
        this._ObjectDef(objectNode);
      }
    }

    if (node.enums) {
      for (const enumNode of node.enums) {
        this._EnumDef(enumNode);
      }
    }
  }

  private _ImportedAbi(node: ImportedAbi) {
    if (this.visitor.ImportedAbi) {
      this.visitor.ImportedAbi(node);
    }

    if (node.functions) {
      for (const functionNode of node.functions) {
        this._FunctionDef(functionNode);
      }
    }

    if (node.objects) {
      for (const objectNode of node.objects) {
        this._ObjectDef(objectNode);
      }
    }

    if (node.enums) {
      for (const enumNode of node.enums) {
        this._EnumDef(enumNode);
      }
    }
  }

  private _FunctionDef(node: FunctionDef) {
    if (this.visitor.FunctionDef) {
      this.visitor.FunctionDef(node);
    }

    if (node.args) {
      for (const argumentNode of node.args) {
        this._ArgumentDef(argumentNode);
      }
    }

    this._ResultDef(node.result);
  }

  private _ArgumentDef(node: ArgumentDef) {
    if (this.visitor.ArgumentDef) {
      this.visitor.ArgumentDef(node);
    }
    this._AnyType(node.type);
  }

  private _ResultDef(node: ResultDef) {
    if (this.visitor.ResultDef) {
      this.visitor.ResultDef(node);
    }
    this._AnyType(node.type);
  }

  private _ObjectDef(node: ObjectDef) {
    if (this.visitor.ObjectDef) {
      this.visitor.ObjectDef(node);
    }
    if (node.props) {
      for (const propertyNode of node.props) {
        this._PropertyDef(propertyNode);
      }
    }
  }

  private _PropertyDef(node: PropertyDef) {
    if (this.visitor.PropertyDef) {
      this.visitor.PropertyDef(node);
    }
    this._AnyType(node.type);
  }

  private _EnumDef(node: EnumDef) {
    if (this.visitor.EnumDef) {
      this.visitor.EnumDef(node);
    }
  }

  private _AnyType(node: AnyType) {
    if (this.visitor.AnyType) {
      this.visitor.AnyType(node);
    }

    switch (node.kind) {
      case "Scalar":
        this._ScalarType(node);
        break;
      case "Array":
        this._ArrayType(node);
        break;
      case "Map":
        this._MapType(node);
        break;
      case "Ref":
        this._RefType(node);
        break;
      case "ImportRef":
        this._ImportRefType(node);
        break;
    }
  }

  private _ScalarType(node: ScalarType) {
    if (this.visitor.ScalarType) {
      this.visitor.ScalarType(node);
    }
  }

  private _RefType(node: RefType) {
    if (this.visitor.RefType) {
      this.visitor.RefType(node);
    }
  }

  private _ImportRefType(node: ImportRefType) {
    if (this.visitor.ImportRefType) {
      this.visitor.ImportRefType(node);
    }
  }

  private _ArrayType(node: ArrayType) {
    if (this.visitor.ArrayType) {
      this.visitor.ArrayType(node);
    }
    this._AnyType(node.item.type);
  }

  private _MapType(node: MapType) {
    if (this.visitor.MapType) {
      this.visitor.MapType(node);
    }
    this._AnyType(node.value.type);
  }

  visit(node: Abi) {
    this._Abi(node);
  }
}