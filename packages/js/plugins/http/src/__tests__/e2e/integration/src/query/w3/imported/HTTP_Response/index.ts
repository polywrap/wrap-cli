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
  serializeHTTP_Response,
  deserializeHTTP_Response,
  writeHTTP_Response,
  readHTTP_Response
} from "./serialization";
import * as Types from "../..";

@serializable
export class HTTP_Response {

  public static uri: string = "w3://ens/http.web3api.eth";

  status: i32;
  statusText: string;
  headers: Array<Types.HTTP_Header> | null;
  body: string | null;

  static toBuffer(type: HTTP_Response): ArrayBuffer {
    return serializeHTTP_Response(type);
  }

  static fromBuffer(buffer: ArrayBuffer): HTTP_Response {
    return deserializeHTTP_Response(buffer);
  }

  static write(writer: Write, type: HTTP_Response): void {
    writeHTTP_Response(writer, type);
  }

  static read(reader: Read): HTTP_Response {
    return readHTTP_Response(reader);
  }

  static toJson(type: HTTP_Response): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): HTTP_Response {
    return (new JSONDeserializer(json)).decode<HTTP_Response>();
  }
}
