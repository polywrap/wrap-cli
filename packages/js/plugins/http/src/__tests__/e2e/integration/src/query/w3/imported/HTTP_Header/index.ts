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
  serializeHTTP_Header,
  deserializeHTTP_Header,
  writeHTTP_Header,
  readHTTP_Header
} from "./serialization";
import * as Types from "../..";

@serializable
export class HTTP_Header {

  public static uri: string = "w3://ens/http.web3api.eth";

  key: string;
  value: string;

  static toBuffer(type: HTTP_Header): ArrayBuffer {
    return serializeHTTP_Header(type);
  }

  static fromBuffer(buffer: ArrayBuffer): HTTP_Header {
    return deserializeHTTP_Header(buffer);
  }

  static write(writer: Write, type: HTTP_Header): void {
    writeHTTP_Header(writer, type);
  }

  static read(reader: Read): HTTP_Header {
    return readHTTP_Header(reader);
  }

  static toJson(type: HTTP_Header): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): HTTP_Header {
    return (new JSONDeserializer(json)).decode<HTTP_Header>();
  }
}
