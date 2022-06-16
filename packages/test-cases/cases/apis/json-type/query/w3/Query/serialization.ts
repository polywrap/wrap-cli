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

export class Input_fromJson {
  json: JSON.Value;
}

export function deserializefromJsonArgs(argsBuf: ArrayBuffer): Input_fromJson {
  const context: Context =  new Context("Deserializing module-type: fromJson");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _json: JSON.Value = JSON.Value.Null();
  let _jsonSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "json") {
      reader.context().push(field, "JSON.Value", "type found, reading property");
      _json = reader.readJSON();
      _jsonSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_jsonSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'json: JSON'"));
  }

  return {
    json: _json
  };
}

export function serializefromJsonResult(result: Types.Pair): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: fromJson");
  const sizer = new WriteSizer(sizerContext);
  writefromJsonResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: fromJson");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writefromJsonResult(encoder, result);
  return buffer;
}

export function writefromJsonResult(writer: Write, result: Types.Pair): void {
  writer.context().push("fromJson", "Types.Pair", "writing property");
  Types.Pair.write(writer, result);
  writer.context().pop();
}

export class Input_toJson {
  pair: Types.Pair;
}

export function deserializetoJsonArgs(argsBuf: ArrayBuffer): Input_toJson {
  const context: Context =  new Context("Deserializing module-type: toJson");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _pair: Types.Pair | null = null;
  let _pairSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "pair") {
      reader.context().push(field, "Types.Pair", "type found, reading property");
      const object = Types.Pair.read(reader);
      _pair = object;
      _pairSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_pair || !_pairSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'pair: Pair'"));
  }

  return {
    pair: _pair
  };
}

export function serializetoJsonResult(result: JSON.Value): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: toJson");
  const sizer = new WriteSizer(sizerContext);
  writetoJsonResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: toJson");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writetoJsonResult(encoder, result);
  return buffer;
}

export function writetoJsonResult(writer: Write, result: JSON.Value): void {
  writer.context().push("toJson", "JSON.Value", "writing property");
  writer.writeJSON(result);
  writer.context().pop();
}
