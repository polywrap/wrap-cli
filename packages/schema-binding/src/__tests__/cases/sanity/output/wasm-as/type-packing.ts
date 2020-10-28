import { Write, WriteSizer, WriteEncoder } from "@web3api/wasm-as";
import {
  CustomType
} from "./";

function __write_CustomType(writer: Write, type: CustomType) {
  writer.writeMapSize(2);
  writer.writeString("str");
  writer.writeString(type.str);
  writer.writeString("u8");
  writer.writeUInt8(type.u8);
}
