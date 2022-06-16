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

export class Input_method1 {
  en: Types.SanityEnum;
  optEnum: Nullable<Types.SanityEnum>;
}

export function deserializemethod1Args(argsBuf: ArrayBuffer): Input_method1 {
  const context: Context =  new Context("Deserializing module-type: method1");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _en: Types.SanityEnum = 0;
  let _enSet: bool = false;
  let _optEnum: Nullable<Types.SanityEnum> = new Nullable<Types.SanityEnum>();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "en") {
      reader.context().push(field, "Types.SanityEnum", "type found, reading property");
      let value: Types.SanityEnum;
      if (reader.isNextString()) {
        value = Types.getSanityEnumValue(reader.readString());
      } else {
        value = reader.readInt32();
        Types.sanitizeSanityEnumValue(value);
      }
      _en = value;
      _enSet = true;
      reader.context().pop();
    }
    else if (field == "optEnum") {
      reader.context().push(field, "Nullable<Types.SanityEnum>", "type found, reading property");
      let value: Nullable<Types.SanityEnum>;
      if (!reader.isNextNil()) {
        if (reader.isNextString()) {
          value = Nullable.fromValue(
            Types.getSanityEnumValue(reader.readString())
          );
        } else {
          value = Nullable.fromValue(
            reader.readInt32()
          );
          Types.sanitizeSanityEnumValue(value.value);
        }
      } else {
        value = Nullable.fromNull<Types.SanityEnum>();
      }
      _optEnum = value;
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_enSet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'en: SanityEnum'"));
  }

  return {
    en: _en,
    optEnum: _optEnum
  };
}

export function serializemethod1Result(result: Types.SanityEnum): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method1");
  const sizer = new WriteSizer(sizerContext);
  writemethod1Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method1");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod1Result(encoder, result);
  return buffer;
}

export function writemethod1Result(writer: Write, result: Types.SanityEnum): void {
  writer.context().push("method1", "Types.SanityEnum", "writing property");
  writer.writeInt32(result);
  writer.context().pop();
}

export class Input_method2 {
  enumArray: Array<Types.SanityEnum>;
  optEnumArray: Array<Nullable<Types.SanityEnum>> | null;
}

export function deserializemethod2Args(argsBuf: ArrayBuffer): Input_method2 {
  const context: Context =  new Context("Deserializing module-type: method2");
  const reader = new ReadDecoder(argsBuf, context);
  let numFields = reader.readMapLength();

  let _enumArray: Array<Types.SanityEnum> = [];
  let _enumArraySet: bool = false;
  let _optEnumArray: Array<Nullable<Types.SanityEnum>> | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    reader.context().push(field, "unknown", "searching for property type");
    if (field == "enumArray") {
      reader.context().push(field, "Array<Types.SanityEnum>", "type found, reading property");
      _enumArray = reader.readArray((reader: Read): Types.SanityEnum => {
        let value: Types.SanityEnum;
        if (reader.isNextString()) {
          value = Types.getSanityEnumValue(reader.readString());
        } else {
          value = reader.readInt32();
          Types.sanitizeSanityEnumValue(value);
        }
        return value;
      });
      _enumArraySet = true;
      reader.context().pop();
    }
    else if (field == "optEnumArray") {
      reader.context().push(field, "Array<Nullable<Types.SanityEnum>> | null", "type found, reading property");
      _optEnumArray = reader.readNullableArray((reader: Read): Nullable<Types.SanityEnum> => {
        let value: Nullable<Types.SanityEnum>;
        if (!reader.isNextNil()) {
          if (reader.isNextString()) {
            value = Nullable.fromValue(
              Types.getSanityEnumValue(reader.readString())
            );
          } else {
            value = Nullable.fromValue(
              reader.readInt32()
            );
            Types.sanitizeSanityEnumValue(value.value);
          }
        } else {
          value = Nullable.fromNull<Types.SanityEnum>();
        }
        return value;
      });
      reader.context().pop();
    }
    reader.context().pop();
  }

  if (!_enumArraySet) {
    throw new Error(reader.context().printWithContext("Missing required argument: 'enumArray: [SanityEnum]'"));
  }

  return {
    enumArray: _enumArray,
    optEnumArray: _optEnumArray
  };
}

export function serializemethod2Result(result: Array<Types.SanityEnum>): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) module-type: method2");
  const sizer = new WriteSizer(sizerContext);
  writemethod2Result(sizer, result);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) module-type: method2");
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writemethod2Result(encoder, result);
  return buffer;
}

export function writemethod2Result(writer: Write, result: Array<Types.SanityEnum>): void {
  writer.context().push("method2", "Array<Types.SanityEnum>", "writing property");
  writer.writeArray(result, (writer: Write, item: Types.SanityEnum): void => {
    writer.writeInt32(item);
  });
  writer.context().pop();
}
