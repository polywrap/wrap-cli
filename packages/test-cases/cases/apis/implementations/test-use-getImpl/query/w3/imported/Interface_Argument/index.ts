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
  serializeInterface_Argument,
  deserializeInterface_Argument,
  writeInterface_Argument,
  readInterface_Argument
} from "./serialization";
import * as Types from "../..";

@serializable
export class Interface_Argument {

  public static uri: string = "w3://ens/interface.eth";

  str: string;

  static toBuffer(type: Interface_Argument): ArrayBuffer {
    return serializeInterface_Argument(type);
  }

  static fromBuffer(buffer: ArrayBuffer): Interface_Argument {
    return deserializeInterface_Argument(buffer);
  }

  static write(writer: Write, type: Interface_Argument): void {
    writeInterface_Argument(writer, type);
  }

  static read(reader: Read): Interface_Argument {
    return readInterface_Argument(reader);
  }

  static toJson(type: Interface_Argument): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): Interface_Argument {
    return (new JSONDeserializer(json)).decode<Interface_Argument>();
  }
}
