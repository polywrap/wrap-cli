import {
  Read,
  ReadDecoder,
  Write,
  WriteSizer,
  WriteEncoder,
  Nullable,
  BigInt,
  JSON,
  Context
} from "@web3api/wasm-as";
import { TestImport_Union } from "./";
import * as Types from "..";

export function serializeTestImport_Union(type: TestImport_Union): ArrayBuffer {
  const sizerContext: Context = new Context("Serializing (sizing) union-type: TestImport_Union");
  const sizer = new WriteSizer(sizerContext);
  writeTestImport_Union(sizer, type);
  const buffer = new ArrayBuffer(sizer.length);
  const encoderContext: Context = new Context("Serializing (encoding) union-type: TestImport_Union");
  const encoder = new WriteEncoder(buffer, encoderContext);
  writeTestImport_Union(encoder, type);
  return buffer;
}

export function writeTestImport_Union(writer: Write, type: TestImport_Union): void {
  writer.writeMapLength(2);
  writer.context().push("TestImport_AnotherObject", "Types.TestImport_AnotherObject | null", "writing property");
  writer.writeString("TestImport_AnotherObject");

  if(type.isTestImport_AnotherObject) {
    Types.TestImport_AnotherObject.write(writer, type.TestImport_AnotherObject)
  } else {
    writer.writeNil();
  }

  writer.context().pop();
  writer.context().push("TestImport_YetAnotherObject", "Types.TestImport_YetAnotherObject | null", "writing property");
  writer.writeString("TestImport_YetAnotherObject");

  if(type.isTestImport_YetAnotherObject) {
    Types.TestImport_YetAnotherObject.write(writer, type.TestImport_YetAnotherObject)
  } else {
    writer.writeNil();
  }

  writer.context().pop();
}

export function deserializeTestImport_Union(buffer: ArrayBuffer): TestImport_Union {
  const context: Context = new Context("Deserializing union-type TestImport_Union");
  const reader = new ReadDecoder(buffer, context);
  return readTestImport_Union(reader);
}

export function readTestImport_Union(reader: Read): TestImport_Union {
  let numFields = reader.readMapLength();

  let TestImport_AnotherObject: Types.TestImport_AnotherObject | null = null;
  let TestImport_YetAnotherObject: Types.TestImport_YetAnotherObject | null = null;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "TestImport_AnotherObject") {
      reader.context().push(field, "Types.TestImport_AnotherObject | null", "type found, reading property");

      if (!reader.isNextNil()) {
        TestImport_AnotherObject = Types.TestImport_AnotherObject.read(reader);
      }

      reader.context().pop();
    }
    else if (field == "TestImport_YetAnotherObject") {
      reader.context().push(field, "Types.TestImport_YetAnotherObject | null", "type found, reading property");

      if (!reader.isNextNil()) {
        TestImport_YetAnotherObject = Types.TestImport_YetAnotherObject.read(reader);
      }

      reader.context().pop();
    }
    reader.context().pop();
  }

  const definedMember =
     TestImport_AnotherObject
    ||  TestImport_YetAnotherObject

  if(!definedMember) {
    throw new Error(`All serialized member types for TestImport_Union are null`)
  }

  return TestImport_Union.create(definedMember)
}
