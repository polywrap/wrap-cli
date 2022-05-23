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
  const encoder = new WriteEncoder(buffer, sizer, encoderContext);
  writeTestImport_Union(encoder, type);
  return buffer;
}

export function writeTestImport_Union(writer: Write, type: TestImport_Union): void {
  if(type.isTestImport_AnotherObject) {
    Types.TestImport_AnotherObject.write(writer, type.TestImport_AnotherObject)
  } else if(type.isTestImport_YetAnotherObject) {
    Types.TestImport_YetAnotherObject.write(writer, type.TestImport_YetAnotherObject)
  } else {
    writer.writeNil();
  }
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

  let unionMemberTypes = [
    "TestImport_AnotherObject",
    "TestImport_YetAnotherObject",
  ]

  let unionMemberType: string;

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if(field == "type") {
      reader.context().push(field, "String", "union member type declaration found, reading property");
      unionMemberType = reader.readString();

      if(!unionMemberTypes.includes(unionMemberType)) {
        throw new Error(`Found invalid union member type '${unionMemberType}' for union 'TestImport_Union'. Valid member types: ${unionMemberTypes.join(", ")}`)
      }

      reader.context().pop();
    }

    if(field == "value") {
      if (unionMemberType == "TestImport_AnotherObject") {
        reader.context().push(field, "Types.TestImport_AnotherObject | null", "value found for union member type 'TestImport_AnotherObject', reading property");

        if (!reader.isNextNil()) {
          TestImport_AnotherObject = Types.TestImport_AnotherObject.read(reader);
        }

        reader.context().pop();
      }
      else if (unionMemberType == "TestImport_YetAnotherObject") {
        reader.context().push(field, "Types.TestImport_YetAnotherObject | null", "value found for union member type 'TestImport_YetAnotherObject', reading property");

        if (!reader.isNextNil()) {
          TestImport_YetAnotherObject = Types.TestImport_YetAnotherObject.read(reader);
        }

        reader.context().pop();
      }
    }
  }

  if(TestImport_AnotherObject) {
    return TestImport_Union.create(TestImport_AnotherObject)
  } else if(TestImport_YetAnotherObject) {
    return TestImport_Union.create(TestImport_YetAnotherObject)
  } else {
    throw new Error(`All serialized union member types for TestImport_Union are null`)
  }
}
