/* eslint-disable */
import { Result } from "./containers";

// Subinvoke Interface

@external("wrap", "__wrap_subinvoke")
export declare function __wrap_subinvoke(
  uri_ptr: u32, uri_len: u32,
  method_ptr: u32, method_len: u32,
  args_ptr: u32, args_len: u32
): bool;

// Subinvoke Result
@external("wrap", "__wrap_subinvoke_result_len")
export declare function __wrap_subinvoke_result_len(): u32;
@external("wrap", "__wrap_subinvoke_result")
export declare function __wrap_subinvoke_result(ptr: u32): void;

// Subinvoke Error
@external("wrap", "__wrap_subinvoke_error_len")
export declare function __wrap_subinvoke_error_len(): u32;
@external("wrap", "__wrap_subinvoke_error")
export declare function __wrap_subinvoke_error(ptr: u32): void;

// Subinvoke Interface Helper
export function wrap_subinvoke(
  uri: string,
  method: string,
  args: ArrayBuffer
): Result<ArrayBuffer, string> {
  const uriBuf = String.UTF8.encode(uri);
  const methodBuf = String.UTF8.encode(method);
  
  const success = __wrap_subinvoke(
    changetype<u32>(uriBuf), uriBuf.byteLength,
    changetype<u32>(methodBuf), methodBuf.byteLength,
    changetype<u32>(args), args.byteLength
  );

  if (!success) {
    const errorLen = __wrap_subinvoke_error_len();
    const messageBuf = new ArrayBuffer(errorLen);
    __wrap_subinvoke_error(changetype<u32>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    return Result.Err<ArrayBuffer, string>(message);
  }

  const resultLen = __wrap_subinvoke_result_len();
  const resultBuffer = new ArrayBuffer(resultLen);
  __wrap_subinvoke_result(changetype<u32>(resultBuffer));

  return Result.Ok<ArrayBuffer, string>(resultBuffer);
}
