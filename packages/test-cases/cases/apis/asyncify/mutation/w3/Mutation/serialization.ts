import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  Context
} from "@web3api/wasm-as";
import * as Types from "..";

export class Input_setDataWithLargeArgs {
  address: string;
  value: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataWithLargeArgsArgs(argsBuf: ArrayBuffer): Input_setDataWithLargeArgs {
  const context: Context =  new Context("Deserializing module-type: setDataWithLargeArgs");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _value: string = "";
  let _valueSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "value") {
      reader.context().push(field, "string", "type found, reading property");
      _value = reader.readString();
      _valueSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_valueSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'value: String'"));
  }

  return {
    address: _address,
    value: _value,
    connection: _connection
  };
}

export function serializesetDataWithLargeArgsResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setDataWithLargeArgs");
  const sizer = new WriteSizer(sizerContext);
  writesetDataWithLargeArgsResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setDataWithLargeArgs");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataWithLargeArgsResult(encoder, result);
  return buffer;
}

export function writesetDataWithLargeArgsResult(writer: Write, result: string): void {
  writer.context().push("setDataWithLargeArgs", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_setDataWithManyArgs {
  address: string;
  valueA: string;
  valueB: string;
  valueC: string;
  valueD: string;
  valueE: string;
  valueF: string;
  valueG: string;
  valueH: string;
  valueI: string;
  valueJ: string;
  valueK: string;
  valueL: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataWithManyArgsArgs(argsBuf: ArrayBuffer): Input_setDataWithManyArgs {
  const context: Context =  new Context("Deserializing module-type: setDataWithManyArgs");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _valueA: string = "";
  let _valueASet: bool = false;
  let _valueB: string = "";
  let _valueBSet: bool = false;
  let _valueC: string = "";
  let _valueCSet: bool = false;
  let _valueD: string = "";
  let _valueDSet: bool = false;
  let _valueE: string = "";
  let _valueESet: bool = false;
  let _valueF: string = "";
  let _valueFSet: bool = false;
  let _valueG: string = "";
  let _valueGSet: bool = false;
  let _valueH: string = "";
  let _valueHSet: bool = false;
  let _valueI: string = "";
  let _valueISet: bool = false;
  let _valueJ: string = "";
  let _valueJSet: bool = false;
  let _valueK: string = "";
  let _valueKSet: bool = false;
  let _valueL: string = "";
  let _valueLSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "valueA") {
      reader.context().push(field, "string", "type found, reading property");
      _valueA = reader.readString();
      _valueASet = true;
      reader.context().pop();
    }
    else if (field == "valueB") {
      reader.context().push(field, "string", "type found, reading property");
      _valueB = reader.readString();
      _valueBSet = true;
      reader.context().pop();
    }
    else if (field == "valueC") {
      reader.context().push(field, "string", "type found, reading property");
      _valueC = reader.readString();
      _valueCSet = true;
      reader.context().pop();
    }
    else if (field == "valueD") {
      reader.context().push(field, "string", "type found, reading property");
      _valueD = reader.readString();
      _valueDSet = true;
      reader.context().pop();
    }
    else if (field == "valueE") {
      reader.context().push(field, "string", "type found, reading property");
      _valueE = reader.readString();
      _valueESet = true;
      reader.context().pop();
    }
    else if (field == "valueF") {
      reader.context().push(field, "string", "type found, reading property");
      _valueF = reader.readString();
      _valueFSet = true;
      reader.context().pop();
    }
    else if (field == "valueG") {
      reader.context().push(field, "string", "type found, reading property");
      _valueG = reader.readString();
      _valueGSet = true;
      reader.context().pop();
    }
    else if (field == "valueH") {
      reader.context().push(field, "string", "type found, reading property");
      _valueH = reader.readString();
      _valueHSet = true;
      reader.context().pop();
    }
    else if (field == "valueI") {
      reader.context().push(field, "string", "type found, reading property");
      _valueI = reader.readString();
      _valueISet = true;
      reader.context().pop();
    }
    else if (field == "valueJ") {
      reader.context().push(field, "string", "type found, reading property");
      _valueJ = reader.readString();
      _valueJSet = true;
      reader.context().pop();
    }
    else if (field == "valueK") {
      reader.context().push(field, "string", "type found, reading property");
      _valueK = reader.readString();
      _valueKSet = true;
      reader.context().pop();
    }
    else if (field == "valueL") {
      reader.context().push(field, "string", "type found, reading property");
      _valueL = reader.readString();
      _valueLSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_valueASet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueA: String'"));
  }
  if (!_valueBSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueB: String'"));
  }
  if (!_valueCSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueC: String'"));
  }
  if (!_valueDSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueD: String'"));
  }
  if (!_valueESet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueE: String'"));
  }
  if (!_valueFSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueF: String'"));
  }
  if (!_valueGSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueG: String'"));
  }
  if (!_valueHSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueH: String'"));
  }
  if (!_valueISet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueI: String'"));
  }
  if (!_valueJSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueJ: String'"));
  }
  if (!_valueKSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueK: String'"));
  }
  if (!_valueLSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueL: String'"));
  }

  return {
    address: _address,
    valueA: _valueA,
    valueB: _valueB,
    valueC: _valueC,
    valueD: _valueD,
    valueE: _valueE,
    valueF: _valueF,
    valueG: _valueG,
    valueH: _valueH,
    valueI: _valueI,
    valueJ: _valueJ,
    valueK: _valueK,
    valueL: _valueL,
    connection: _connection
  };
}

export function serializesetDataWithManyArgsResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setDataWithManyArgs");
  const sizer = new WriteSizer(sizerContext);
  writesetDataWithManyArgsResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setDataWithManyArgs");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataWithManyArgsResult(encoder, result);
  return buffer;
}

export function writesetDataWithManyArgsResult(writer: Write, result: string): void {
  writer.context().push("setDataWithManyArgs", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_setDataWithManyStructuredArgs {
  address: string;
  valueA: Types.BigObj;
  valueB: Types.BigObj;
  valueC: Types.BigObj;
  valueD: Types.BigObj;
  valueE: Types.BigObj;
  valueF: Types.BigObj;
  valueG: Types.BigObj;
  valueH: Types.BigObj;
  valueI: Types.BigObj;
  valueJ: Types.BigObj;
  valueK: Types.BigObj;
  valueL: Types.BigObj;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesetDataWithManyStructuredArgsArgs(argsBuf: ArrayBuffer): Input_setDataWithManyStructuredArgs {
  const context: Context =  new Context("Deserializing module-type: setDataWithManyStructuredArgs");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _valueA: Types.BigObj | null = null;
  let _valueASet: bool = false;
  let _valueB: Types.BigObj | null = null;
  let _valueBSet: bool = false;
  let _valueC: Types.BigObj | null = null;
  let _valueCSet: bool = false;
  let _valueD: Types.BigObj | null = null;
  let _valueDSet: bool = false;
  let _valueE: Types.BigObj | null = null;
  let _valueESet: bool = false;
  let _valueF: Types.BigObj | null = null;
  let _valueFSet: bool = false;
  let _valueG: Types.BigObj | null = null;
  let _valueGSet: bool = false;
  let _valueH: Types.BigObj | null = null;
  let _valueHSet: bool = false;
  let _valueI: Types.BigObj | null = null;
  let _valueISet: bool = false;
  let _valueJ: Types.BigObj | null = null;
  let _valueJSet: bool = false;
  let _valueK: Types.BigObj | null = null;
  let _valueKSet: bool = false;
  let _valueL: Types.BigObj | null = null;
  let _valueLSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "valueA") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueA = object;
      _valueASet = true;
      reader.context().pop();
    }
    else if (field == "valueB") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueB = object;
      _valueBSet = true;
      reader.context().pop();
    }
    else if (field == "valueC") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueC = object;
      _valueCSet = true;
      reader.context().pop();
    }
    else if (field == "valueD") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueD = object;
      _valueDSet = true;
      reader.context().pop();
    }
    else if (field == "valueE") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueE = object;
      _valueESet = true;
      reader.context().pop();
    }
    else if (field == "valueF") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueF = object;
      _valueFSet = true;
      reader.context().pop();
    }
    else if (field == "valueG") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueG = object;
      _valueGSet = true;
      reader.context().pop();
    }
    else if (field == "valueH") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueH = object;
      _valueHSet = true;
      reader.context().pop();
    }
    else if (field == "valueI") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueI = object;
      _valueISet = true;
      reader.context().pop();
    }
    else if (field == "valueJ") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueJ = object;
      _valueJSet = true;
      reader.context().pop();
    }
    else if (field == "valueK") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueK = object;
      _valueKSet = true;
      reader.context().pop();
    }
    else if (field == "valueL") {
      reader.context().push(field, "Types.BigObj", "type found, reading property");
      const object = Types.BigObj.read(reader);
      _valueL = object;
      _valueLSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_valueA || !_valueASet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueA: BigObj'"));
  }
  if (!_valueB || !_valueBSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueB: BigObj'"));
  }
  if (!_valueC || !_valueCSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueC: BigObj'"));
  }
  if (!_valueD || !_valueDSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueD: BigObj'"));
  }
  if (!_valueE || !_valueESet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueE: BigObj'"));
  }
  if (!_valueF || !_valueFSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueF: BigObj'"));
  }
  if (!_valueG || !_valueGSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueG: BigObj'"));
  }
  if (!_valueH || !_valueHSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueH: BigObj'"));
  }
  if (!_valueI || !_valueISet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueI: BigObj'"));
  }
  if (!_valueJ || !_valueJSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueJ: BigObj'"));
  }
  if (!_valueK || !_valueKSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueK: BigObj'"));
  }
  if (!_valueL || !_valueLSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'valueL: BigObj'"));
  }

  return {
    address: _address,
    valueA: _valueA,
    valueB: _valueB,
    valueC: _valueC,
    valueD: _valueD,
    valueE: _valueE,
    valueF: _valueF,
    valueG: _valueG,
    valueH: _valueH,
    valueI: _valueI,
    valueJ: _valueJ,
    valueK: _valueK,
    valueL: _valueL,
    connection: _connection
  };
}

export function serializesetDataWithManyStructuredArgsResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: setDataWithManyStructuredArgs");
  const sizer = new WriteSizer(sizerContext);
  writesetDataWithManyStructuredArgsResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: setDataWithManyStructuredArgs");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesetDataWithManyStructuredArgsResult(encoder, result);
  return buffer;
}

export function writesetDataWithManyStructuredArgsResult(writer: Write, result: bool): void {
  writer.context().push("setDataWithManyStructuredArgs", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_deployContract {
  connection: Types.Ethereum_Connection | null;
}

export function deserializedeployContractArgs(argsBuf: ArrayBuffer): Input_deployContract {
  const context: Context =  new Context("Deserializing module-type: deployContract");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }


  return {
    connection: _connection
  };
}

export function serializedeployContractResult(result: string): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: deployContract");
  const sizer = new WriteSizer(sizerContext);
  writedeployContractResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: deployContract");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writedeployContractResult(encoder, result);
  return buffer;
}

export function writedeployContractResult(writer: Write, result: string): void {
  writer.context().push("deployContract", "string", "writing property");
  writer.writeString(result);
  writer.context().pop();
}

export class Input_localVarMethod {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializelocalVarMethodArgs(argsBuf: ArrayBuffer): Input_localVarMethod {
  const context: Context =  new Context("Deserializing module-type: localVarMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializelocalVarMethodResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: localVarMethod");
  const sizer = new WriteSizer(sizerContext);
  writelocalVarMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: localVarMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writelocalVarMethodResult(encoder, result);
  return buffer;
}

export function writelocalVarMethodResult(writer: Write, result: bool): void {
  writer.context().push("localVarMethod", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_globalVarMethod {
  address: string;
  connection: Types.Ethereum_Connection | null;
}

export function deserializeglobalVarMethodArgs(argsBuf: ArrayBuffer): Input_globalVarMethod {
  const context: Context =  new Context("Deserializing module-type: globalVarMethod");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }

  return {
    address: _address,
    connection: _connection
  };
}

export function serializeglobalVarMethodResult(result: bool): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: globalVarMethod");
  const sizer = new WriteSizer(sizerContext);
  writeglobalVarMethodResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: globalVarMethod");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeglobalVarMethodResult(encoder, result);
  return buffer;
}

export function writeglobalVarMethodResult(writer: Write, result: bool): void {
  writer.context().push("globalVarMethod", "bool", "writing property");
  writer.writeBool(result);
  writer.context().pop();
}

export class Input_subsequentInvokes {
  address: string;
  numberOfTimes: i32;
  connection: Types.Ethereum_Connection | null;
}

export function deserializesubsequentInvokesArgs(argsBuf: ArrayBuffer): Input_subsequentInvokes {
  const context: Context =  new Context("Deserializing module-type: subsequentInvokes");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _address: string = "";
  let _addressSet: bool = false;
  let _numberOfTimes: i32 = 0;
  let _numberOfTimesSet: bool = false;
  let _connection: Types.Ethereum_Connection | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "address") {
      reader.context().push(field, "string", "type found, reading property");
      _address = reader.readString();
      _addressSet = true;
      reader.context().pop();
    }
    else if (field == "numberOfTimes") {
      reader.context().push(field, "i32", "type found, reading property");
      _numberOfTimes = reader.readInt32();
      _numberOfTimesSet = true;
      reader.context().pop();
    }
    else if (field == "connection") {
      reader.context().push(field, "Types.Ethereum_Connection | null", "type found, reading property");
      let object: Types.Ethereum_Connection | null = null;
      if (!reader.isNextNil()) {
        object = Types.Ethereum_Connection.read(reader);
      }
      _connection = object;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_addressSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'address: String'"));
  }
  if (!_numberOfTimesSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'numberOfTimes: Int'"));
  }

  return {
    address: _address,
    numberOfTimes: _numberOfTimes,
    connection: _connection
  };
}

export function serializesubsequentInvokesResult(result: Array<string>): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: subsequentInvokes");
  const sizer = new WriteSizer(sizerContext);
  writesubsequentInvokesResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: subsequentInvokes");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writesubsequentInvokesResult(encoder, result);
  return buffer;
}

export function writesubsequentInvokesResult(writer: Write, result: Array<string>): void {
  writer.context().push("subsequentInvokes", "Array<string>", "writing property");
  writer.writeArray(result, (writer: Write, item: string): void => {
    writer.writeString(item);
  });
  writer.context().pop();
}
