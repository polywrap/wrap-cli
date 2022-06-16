import {
  Read,
  Write,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@web3api/wasm-as";
import {
  serializeInterface_InterfaceType,
  deserializeInterface_InterfaceType,
  writeInterface_InterfaceType,
  readInterface_InterfaceType
} from "./serialization";
import * as Types from "../..";

@serializable
export class Interface_InterfaceType {

  public static uri: string = "w3://ens/interface.eth";

  uint8: u8;

  static toBuffer(type: Interface_InterfaceType): ArrayBuffer {
    return serializeInterface_InterfaceType(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Interface_InterfaceType {
    return deserializeInterface_InterfaceType(buffer);
  }

  static write(writer: Write, type: Interface_InterfaceType): void {
    writeInterface_InterfaceType(writer, type);
  }

  static read(reader: Read): Interface_InterfaceType {
    return readInterface_InterfaceType(reader);
  }

  static toJson(type: Interface_InterfaceType): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Interface_InterfaceType {
    return (new JSONDeserializer(json)).decode<Interface_InterfaceType>();
  }
}
