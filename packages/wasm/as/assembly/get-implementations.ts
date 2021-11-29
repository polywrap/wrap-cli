/* eslint-disable */

import { ReadDecoder, Read } from "./msgpack";

@external("w3", "__w3_getImplementations")
export declare function __w3_getImplementations(
  uri_ptr: u32, uri_len: u32
): bool;

@external("w3", "__w3_getImplementations_result_len")
export declare function __w3_getImplementations_result_len(): u32;

@external("w3", "__w3_getImplementations_result")
export declare function __w3_getImplementations_result(ptr: u32): void;

export function w3_getImplementations(
  uri: string
): string[] {
  const uriBuf = String.UTF8.encode(uri);

  const success = __w3_getImplementations(
    changetype<u32>(uriBuf), uriBuf.byteLength
  );

  if (!success) {
    return [];
  }

  const resultLen = __w3_getImplementations_result_len();
  const resultBuffer = new ArrayBuffer(resultLen);
  __w3_getImplementations_result(changetype<u32>(resultBuffer));

  // Deserialize the msgpack buffer,
  // which contains an array of strings
  const decoder = new ReadDecoder(resultBuffer);
  decoder.context().push(
    "__w3_getImplementations_result",
    "string[]",
    "__w3_getImplementations successful"
  );

  const result: string[] = decoder.readArray(
    (reader: Read): string => {
      return reader.readString();
    }
  );

  return result;
}
