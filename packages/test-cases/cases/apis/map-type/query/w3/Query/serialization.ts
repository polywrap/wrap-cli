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

export class Input_getKey {
  key: string;
  map: Map<string, i32>;
}

export function deserializegetKeyArgs(argsBuf: ArrayBuffer): Input_getKey {
  const context: Context =  new Context("Deserializing module-type: getKey");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _key: string = "";
  let _keySet: bool = false;
  let _map: Map<string, i32> = new Map<string, i32>();
  let _mapSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "key") {
      reader.context().push(field, "string", "type found, reading property");
      _key = reader.readString();
      _keySet = true;
      reader.context().pop();
    }
    else if (field == "map") {
      reader.context().push(field, "Map<string, i32>", "type found, reading property");
      _map = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): i32 => {
        return reader.readInt32();
      });
      _mapSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_keySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'key: String'"));
  }
  if (!_mapSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'map: Map<String, Int>'"));
  }

  return {
    key: _key,
    map: _map
  };
}

export function serializegetKeyResult(result: i32): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: getKey");
  const sizer = new WriteSizer(sizerContext);
  writegetKeyResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: getKey");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writegetKeyResult(encoder, result);
  return buffer;
}

export function writegetKeyResult(writer: Write, result: i32): void {
  writer.context().push("getKey", "i32", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Input_returnMap {
  map: Map<string, i32>;
}

export function deserializereturnMapArgs(argsBuf: ArrayBuffer): Input_returnMap {
  const context: Context =  new Context("Deserializing module-type: returnMap");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _map: Map<string, i32> = new Map<string, i32>();
  let _mapSet: bool = false;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "map") {
      reader.context().push(field, "Map<string, i32>", "type found, reading property");
      _map = reader.readExtGenericMap((reader: Read): string => {
        return reader.readString();
      }, (reader: Read): i32 => {
        return reader.readInt32();
      });
      _mapSet = true;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_mapSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'map: Map<String, Int>'"));
  }

  return {
    map: _map
  };
}

export function serializereturnMapResult(result: Map<string, i32>): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: returnMap");
  const sizer = new WriteSizer(sizerContext);
  writereturnMapResult(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: returnMap");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writereturnMapResult(encoder, result);
  return buffer;
}

export function writereturnMapResult(writer: Write, result: Map<string, i32>): void {
  writer.context().push("returnMap", "Map<string, i32>", "writing property");
  writer.writeExtGenericMap(result, (writer: Write, key: string) => {
    writer.writeString(key);
  }, (writer: Write, value: i32): void => {
    writer.writeInt32(value);
  });
  writer.context().pop();
}
