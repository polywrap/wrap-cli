/* eslint-disable */
import { Result } from "./containers";

// Subinvoke API

@external("w3", "__w3_subinvoke")
export declare function __w3_subinvoke(
  uri_ptr: u32, uri_len: u32,
  module_ptr: u32, module_len: u32,
  method_ptr: u32, method_len: u32,
  input_ptr: u32, input_len: u32
): bool;

// Subinvoke Result
@external("w3", "__w3_subinvoke_result_len")
export declare function __w3_subinvoke_result_len(): u32;
@external("w3", "__w3_subinvoke_result")
export declare function __w3_subinvoke_result(ptr: u32): void;

// Subinvoke Error
@external("w3", "__w3_subinvoke_error_len")
export declare function __w3_subinvoke_error_len(): u32;
@external("w3", "__w3_subinvoke_error")
export declare function __w3_subinvoke_error(ptr: u32): void;

// Subinvoke API Helper
export function w3_subinvoke(
  uri: string,
  module: string,
  method: string,
  input: ArrayBuffer
): Result<ArrayBuffer, string> {
  const uriBuf = String.UTF8.encode(uri);
  const moduleBuf = String.UTF8.encode(module);
  const methodBuf = String.UTF8.encode(method);
  
  const success = __w3_subinvoke(
    changetype<u32>(uriBuf), uriBuf.byteLength,
    changetype<u32>(moduleBuf), moduleBuf.byteLength,
    changetype<u32>(methodBuf), methodBuf.byteLength,
    changetype<u32>(input), input.byteLength
  );

  if (!success) {
    const errorLen = __w3_subinvoke_error_len();
    const messageBuf = new ArrayBuffer(errorLen);
    __w3_subinvoke_error(changetype<u32>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    return Result.Err<ArrayBuffer, string>(message);
  }

  const resultLen = __w3_subinvoke_result_len();
  const resultBuffer = new ArrayBuffer(resultLen);
  __w3_subinvoke_result(changetype<u32>(resultBuffer));

  return Result.Ok<ArrayBuffer, string>(resultBuffer);
}
