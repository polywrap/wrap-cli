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
import { BigObj } from "./";
import * as Types from "..";

export function serializeBigObj(type: BigObj): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) object-type: BigObj");
  const sizer = new WriteSizer(sizerContext);
  writeBigObj(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) object-type: BigObj");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeBigObj(encoder, type);
  return buffer;
}

export function writeBigObj(writer: Write, type: BigObj): void {
  writer.writeMapLength(12);
  writer.context().push("propA", "string", "writing property");
  writer.writeString("propA");
  writer.writeString(type.propA);
  writer.context().pop();
  writer.context().push("propB", "string", "writing property");
  writer.writeString("propB");
  writer.writeString(type.propB);
  writer.context().pop();
  writer.context().push("propC", "string", "writing property");
  writer.writeString("propC");
  writer.writeString(type.propC);
  writer.context().pop();
  writer.context().push("propD", "string", "writing property");
  writer.writeString("propD");
  writer.writeString(type.propD);
  writer.context().pop();
  writer.context().push("propE", "string", "writing property");
  writer.writeString("propE");
  writer.writeString(type.propE);
  writer.context().pop();
  writer.context().push("propF", "string", "writing property");
  writer.writeString("propF");
  writer.writeString(type.propF);
  writer.context().pop();
  writer.context().push("propG", "string", "writing property");
  writer.writeString("propG");
  writer.writeString(type.propG);
  writer.context().pop();
  writer.context().push("propH", "string", "writing property");
  writer.writeString("propH");
  writer.writeString(type.propH);
  writer.context().pop();
  writer.context().push("propI", "string", "writing property");
  writer.writeString("propI");
  writer.writeString(type.propI);
  writer.context().pop();
  writer.context().push("propJ", "string", "writing property");
  writer.writeString("propJ");
  writer.writeString(type.propJ);
  writer.context().pop();
  writer.context().push("propK", "string", "writing property");
  writer.writeString("propK");
  writer.writeString(type.propK);
  writer.context().pop();
  writer.context().push("propL", "string", "writing property");
  writer.writeString("propL");
  writer.writeString(type.propL);
  writer.context().pop();
}

export function deserializeBigObj(buffer: ArrayBuffer): BigObj {
  const context: Context = new Context("Deserializing object-type BigObj");
  const reader = new ReadDecoder(buffer, context);
  return readBigObj(reader);
}

export function readBigObj(reader: Read): BigObj {
  let numFields = reader.readMapLength();

  let _propA: string = "";
  let _propASet: bool = false;
  let _propB: string = "";
  let _propBSet: bool = false;
  let _propC: string = "";
  let _propCSet: bool = false;
  let _propD: string = "";
  let _propDSet: bool = false;
  let _propE: string = "";
  let _propESet: bool = false;
  let _propF: string = "";
  let _propFSet: bool = false;
  let _propG: string = "";
  let _propGSet: bool = false;
  let _propH: string = "";
  let _propHSet: bool = false;
  let _propI: string = "";
  let _propISet: bool = false;
  let _propJ: string = "";
  let _propJSet: bool = false;
  let _propK: string = "";
  let _propKSet: bool = false;
  let _propL: string = "";
  let _propLSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "propA") {
      reader.context().push(field, "string", "type found, reading property");
      _propA = reader.readString();
      _propASet = true;
      reader.context().pop();
    }
    else if (field == "propB") {
      reader.context().push(field, "string", "type found, reading property");
      _propB = reader.readString();
      _propBSet = true;
      reader.context().pop();
    }
    else if (field == "propC") {
      reader.context().push(field, "string", "type found, reading property");
      _propC = reader.readString();
      _propCSet = true;
      reader.context().pop();
    }
    else if (field == "propD") {
      reader.context().push(field, "string", "type found, reading property");
      _propD = reader.readString();
      _propDSet = true;
      reader.context().pop();
    }
    else if (field == "propE") {
      reader.context().push(field, "string", "type found, reading property");
      _propE = reader.readString();
      _propESet = true;
      reader.context().pop();
    }
    else if (field == "propF") {
      reader.context().push(field, "string", "type found, reading property");
      _propF = reader.readString();
      _propFSet = true;
      reader.context().pop();
    }
    else if (field == "propG") {
      reader.context().push(field, "string", "type found, reading property");
      _propG = reader.readString();
      _propGSet = true;
      reader.context().pop();
    }
    else if (field == "propH") {
      reader.context().push(field, "string", "type found, reading property");
      _propH = reader.readString();
      _propHSet = true;
      reader.context().pop();
    }
    else if (field == "propI") {
      reader.context().push(field, "string", "type found, reading property");
      _propI = reader.readString();
      _propISet = true;
      reader.context().pop();
    }
    else if (field == "propJ") {
      reader.context().push(field, "string", "type found, reading property");
      _propJ = reader.readString();
      _propJSet = true;
      reader.context().pop();
    }
    else if (field == "propK") {
      reader.context().push(field, "string", "type found, reading property");
      _propK = reader.readString();
      _propKSet = true;
      reader.context().pop();
    }
    else if (field == "propL") {
      reader.context().push(field, "string", "type found, reading property");
      _propL = reader.readString();
      _propLSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_propASet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propA: String'"));
  }
  if (!_propBSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propB: String'"));
  }
  if (!_propCSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propC: String'"));
  }
  if (!_propDSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propD: String'"));
  }
  if (!_propESet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propE: String'"));
  }
  if (!_propFSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propF: String'"));
  }
  if (!_propGSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propG: String'"));
  }
  if (!_propHSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propH: String'"));
  }
  if (!_propISet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propI: String'"));
  }
  if (!_propJSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propJ: String'"));
  }
  if (!_propKSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propK: String'"));
  }
  if (!_propLSet) {
    throw new Error(reader.context().printWithContext("Missing required property: 'propL: String'"));
  }

  return {
    propA: _propA,
    propB: _propB,
    propC: _propC,
    propD: _propD,
    propE: _propE,
    propF: _propF,
    propG: _propG,
    propH: _propH,
    propI: _propI,
    propJ: _propJ,
    propK: _propK,
    propL: _propL
  };
}
