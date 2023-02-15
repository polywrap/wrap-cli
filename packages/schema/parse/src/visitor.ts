import { EnumDef, ScalarType, RefType } from "./definitions";
import {
  UnlinkedAbiDefs,
  UnlinkedFunctionDef,
  UnlinkedArgumentDef,
  UnlinkedResultDef,
  UnlinkedObjectDef,
  UnlinkedPropertyDef,
  UnlinkedImportRefType,
  UnlinkedAnyType,
  UnlinkedArrayType,
  UnlinkedMapType
} from "./UnlinkedDefs";

interface IUnlinkedAbiVisitor {
  Abi?: (node: UnlinkedAbiDefs) => void;
  FunctionDef?: (node: UnlinkedFunctionDef) => void;
  ArgumentDef?: (node: UnlinkedArgumentDef) => void;
  ResultDef?: (node: UnlinkedResultDef) => void;
  ObjectDef?: (node: UnlinkedObjectDef) => void;
  PropertyDef?: (node: UnlinkedPropertyDef) => void;
  EnumDef?: (node: EnumDef) => void;
  ScalarType?: (node: ScalarType) => void;
  RefType?: (node: RefType) => void;
  ImportRefType?: (node: UnlinkedImportRefType) => void;
  ArrayType?: (node: UnlinkedArrayType) => void;
  MapType?: (node: UnlinkedMapType) => void;
  AnyType?: (node: UnlinkedAnyType) => void;
}

interface IUnlinkedAbiVisitorEnterAndLeave {
  enter?: IUnlinkedAbiVisitor;
  leave?: IUnlinkedAbiVisitor;
}

export class UnlinkedAbiVisitor {
  constructor(private readonly visitor: IUnlinkedAbiVisitorEnterAndLeave) { }

  private _Abi(node: UnlinkedAbiDefs) {
    if (this.visitor.enter?.Abi) {
      this.visitor.enter.Abi(node);
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

    if (this.visitor.leave?.Abi) {
      this.visitor.leave.Abi(node);
    }
  }

  private _FunctionDef(node: UnlinkedFunctionDef) {
    if (this.visitor.enter?.FunctionDef) {
      this.visitor.enter.FunctionDef(node);
    }

    if (node.args) {
      for (const argumentNode of node.args) {
        this._ArgumentDef(argumentNode);
      }
    }

    this._ResultDef(node.result);

    if (this.visitor.leave?.FunctionDef) {
      this.visitor.leave.FunctionDef(node);
    }
  }

  private _ArgumentDef(node: UnlinkedArgumentDef) {
    if (this.visitor.enter?.ArgumentDef) {
      this.visitor.enter.ArgumentDef(node);
    }
    this._AnyType(node.type);

    if (this.visitor.leave?.ArgumentDef) {
      this.visitor.leave.ArgumentDef(node);
    }
  }

  private _ResultDef(node: UnlinkedResultDef) {
    if (this.visitor.enter?.ResultDef) {
      this.visitor.enter.ResultDef(node);
    }
    this._AnyType(node.type);

    if (this.visitor.leave?.ResultDef) {
      this.visitor.leave.ResultDef(node);
    }
  }

  private _ObjectDef(node: UnlinkedObjectDef) {
    if (this.visitor.enter?.ObjectDef) {
      this.visitor.enter.ObjectDef(node);
    }
    if (node.props) {
      for (const propertyNode of node.props) {
        this._PropertyDef(propertyNode);
      }
    }
    if (this.visitor.leave?.ObjectDef) {
      this.visitor.leave.ObjectDef(node);
    }
  }

  private _PropertyDef(node: UnlinkedPropertyDef) {
    if (this.visitor.enter?.PropertyDef) {
      this.visitor.enter.PropertyDef(node);
    }
    this._AnyType(node.type);
    if (this.visitor.leave?.PropertyDef) {
      this.visitor.leave?.PropertyDef(node);
    }
  }

  private _EnumDef(node: EnumDef) {
    if (this.visitor.enter?.EnumDef) {
      this.visitor.enter.EnumDef(node);
    }

    if (this.visitor.leave?.EnumDef) {
      this.visitor.leave.EnumDef(node);
    }
  }

  private _AnyType(node: UnlinkedAnyType) {
    if (this.visitor.enter?.AnyType) {
      this.visitor.enter.AnyType(node);
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
      case "UnlinkedImportRef":
        this._ImportRefType(node);
        break;
    }

    if (this.visitor.leave?.AnyType) {
      this.visitor.leave.AnyType(node);
    }
  }

  private _ScalarType(node: ScalarType) {
    if (this.visitor.enter?.ScalarType) {
      this.visitor.enter.ScalarType(node);
    }

    if (this.visitor.leave?.ScalarType) {
      this.visitor.leave.ScalarType(node);
    }
  }

  private _RefType(node: RefType) {
    if (this.visitor.enter?.RefType) {
      this.visitor.enter.RefType(node);
    }

    if (this.visitor.leave?.RefType) {
      this.visitor.leave.RefType(node);
    }
  }

  private _ImportRefType(node: UnlinkedImportRefType) {
    if (this.visitor.enter?.ImportRefType) {
      this.visitor.enter.ImportRefType(node);
    }

    if (this.visitor.leave?.ImportRefType) {
      this.visitor.leave.ImportRefType(node);
    }
  }

  private _ArrayType(node: UnlinkedArrayType) {
    if (this.visitor.enter?.ArrayType) {
      this.visitor.enter.ArrayType(node);
    }
    this._AnyType(node.item.type);

    if (this.visitor.leave?.ArrayType) {
      this.visitor.leave.ArrayType(node);
    }
  }

  private _MapType(node: UnlinkedMapType) {
    if (this.visitor.enter?.MapType) {
      this.visitor.enter.MapType(node);
    }
    this._AnyType(node.value.type);

    if (this.visitor.leave?.MapType) {
      this.visitor.leave.MapType(node);
    }
  }

  visit(node: UnlinkedAbiDefs) {
    this._Abi(node);
  }
}