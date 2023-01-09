import { Abi, AnyType, ArgumentDef, ArrayType, EnumDef, EnvDef, FunctionDef, MapKeyTypeName, MapType, ObjectDef, PropertyDef, RefType, ResultDef, ScalarType } from "../definitions";

export interface AbiTransforms {
  enter?: AbiTransformer;
  leave?: AbiTransformer;
}

type TypeToTransform =
  | FunctionDef
  | ObjectDef
  | EnumDef
  | EnvDef
  | ArgumentDef
  | ResultDef
  | PropertyDef
  | ScalarType
  | ArrayType
  | MapType
  | RefType

export interface AbiTransformer {
  FunctionDefinition?: (def: FunctionDef) => FunctionDef
  ObjectDefinition?: (def: ObjectDef) => ObjectDef
  EnumDefinition?: (def: EnumDef) => EnumDef
  EnvDefinition?: (def: EnvDef) => EnvDef

  ArgumentDefinition?: (def: ArgumentDef) => ArgumentDef
  ResultDefinition?: (def: ResultDef) => ResultDef
  PropertyDefinition?: (def: PropertyDef) => PropertyDef

  ScalarType?: (type: ScalarType) => ScalarType
  ArrayType?: (type: ArrayType) => ArrayType
  MapType?: (type: MapType) => MapType
  RefType?: (type: RefType) => RefType

  Abi?: (abi: Abi) => Abi
}

export const transformAbi = (abi: Abi, transforms: AbiTransforms): Abi => {
  let result = Object.assign({}, abi);

  if (transforms.enter && transforms.enter.Abi) {
    result = transforms.enter.Abi(result);
  }

  result.enums = result.enums?.map(def => visitEnumDefinition(def, transforms))
  result.objects = result.objects?.map(def => visitObjectDefinition(def, transforms))
  result.functions = result.functions?.map(def => visitFunctionDefinition(def, transforms))
  result.env = result.env ? visitEnvDefinition(result.env, transforms) : undefined

  if (transforms.leave && transforms.leave.Abi) {
    result = transforms.leave.Abi(result);
  }

  return result;
}

const transformType = <T extends TypeToTransform>(type: T, transform?: AbiTransformer): T => {
  if (!transform) {
    return type;
  }

  let result: T = Object.assign({}, type);
  const {
    FunctionDefinition,
    ObjectDefinition,
    EnumDefinition,
    EnvDefinition,
    ArgumentDefinition,
    ResultDefinition,
    PropertyDefinition,
    ScalarType,
    ArrayType,
    MapType,
    RefType,
  } = transform;

  if (FunctionDefinition && result.kind === "Function") {
    result = Object.assign(result, FunctionDefinition(result))
  } else if (ObjectDefinition && result.kind === "Object") {
    result = Object.assign(result, ObjectDefinition(result))
  } else if (EnumDefinition && result.kind === "Enum") {
    result = Object.assign(result, EnumDefinition(result))
  } else if (EnvDefinition && result.kind === "Env") {
    result = Object.assign(result, EnvDefinition(result))
  } else if (ArgumentDefinition && result.kind === "Argument") {
    result = Object.assign(result, ArgumentDefinition(result))
  } else if (ResultDefinition && result.kind === "Result") {
    result = Object.assign(result, ResultDefinition(result))
  } else if (PropertyDefinition && result.kind === "Property") {
    result = Object.assign(result, PropertyDefinition(result))
  } else if (ScalarType && result.kind === "Scalar") {
    result = Object.assign(result, ScalarType(result))
  } else if (ArrayType && result.kind === "Array") {
    result = Object.assign(result, ArrayType(result))
  } else if (MapType && result.kind === "Map") {
    result = Object.assign(result, MapType(result))
  } else if (RefType && result.kind === "Ref") {
    result = Object.assign(result, RefType(result))
  }

  return result;
}

const visitRefType = (type: RefType, transforms: AbiTransforms) => {
  let result = Object.assign({}, type);
  result = transformType(result, transforms.enter)

  return transformType(result, transforms.leave)
}

const visitScalarType = (type: ScalarType, transforms: AbiTransforms) => {
  let result = Object.assign({}, type);
  result = transformType(result, transforms.enter)

  return transformType(result, transforms.leave);
}

const visitArrayType = (type: ArrayType, transforms: AbiTransforms) => {
  let result = Object.assign({}, type);
  result = transformType(result, transforms.enter)

  result.item = visitAnyType(result.item, transforms)
  return transformType(result, transforms.leave);
}

const visitMapType = (type: MapType, transforms: AbiTransforms) => {
  let result = Object.assign({}, type);
  result = transformType(result, transforms.enter)

  result.key = visitScalarType(result.key, transforms) as ScalarType<MapKeyTypeName>
  result.value = visitAnyType(result.value, transforms)
  return transformType(result, transforms.leave);
}

const visitAnyType = (type: AnyType, transforms: AbiTransforms) => {
  switch (type.kind) {
    case "Ref": return visitRefType(type, transforms);
    case "Array": return visitArrayType(type, transforms);
    case "Scalar": return visitScalarType(type, transforms);
    case "Map": return visitMapType(type, transforms);
  }
}

const visitPropertyDefinition = (def: PropertyDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter)
  result.type = visitAnyType(result.type, transforms);

  return transformType(result, transforms.leave)
}

const visitObjectDefinition = (def: ObjectDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result.props.forEach((prop, i) => {
    result.props[i] = visitPropertyDefinition(prop, transforms)
  })

  return transformType(result, transforms.leave)
}

const visitEnvDefinition = (def: EnvDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result.props.forEach((prop, i) => {
    result.props[i] = visitPropertyDefinition(prop, transforms)
  })

  return transformType(result, transforms.leave)
}

const visitEnumDefinition = (def: EnumDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave)
}

const visitArgumentDefinition = (def: ArgumentDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  result.type = visitAnyType(result.type, transforms);
  return transformType(result, transforms.leave)
}

const visitResultDefinition = (def: ResultDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  result.type = visitAnyType(result.type, transforms);
  return transformType(result, transforms.leave)
}

const visitFunctionDefinition = (def: FunctionDef, transforms: AbiTransforms) => {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result.args = result.args.map(arg => visitArgumentDefinition(arg, transforms))
  result.result = visitResultDefinition(result.result, transforms)

  return transformType(result, transforms.leave)
}