/* eslint-disable */
import { Result } from "./containers";

// Implementation Subinvoke Interface

@external("wrap", "__wrap_subinvokeImplementation")
export declare function __wrap_subinvokeImplementation(
  interface_uri_ptr: u32, interface_uri_len: u32,
  impl_uri_ptr: u32, impl_uri_len: u32,
  method_ptr: u32, method_len: u32,
  args_ptr: u32, args_len: u32
): bool;

// Implementation Subinvoke Result
@external("wrap", "__wrap_subinvokeImplementation_result_len")
export declare function __wrap_subinvokeImplementation_result_len(): u32;
@external("wrap", "__wrap_subinvokeImplementation_result")
export declare function __wrap_subinvokeImplementation_result(ptr: u32): void;

// Subinvoke Error
@external("wrap", "__wrap_subinvokeImplementation_error_len")
export declare function __wrap_subinvokeImplementation_error_len(): u32;
@external("wrap", "__wrap_subinvokeImplementation_error")
export declare function __wrap_subinvokeImplementation_error(ptr: u32): void;

// Implementation Subinvoke Interface Helper
export function wrap_subinvokeImplementation(
  interfaceUri: string,
  implUri: string,
  method: string,
  args: ArrayBuffer
): Result<ArrayBuffer, string> {
  const interfaceUriBuf = String.UTF8.encode(interfaceUri);
  const implUriBuf = String.UTF8.encode(implUri);
  const methodBuf = String.UTF8.encode(method);
  
  const success = __wrap_subinvokeImplementation(
    changetype<u32>(interfaceUriBuf), interfaceUriBuf.byteLength,
    changetype<u32>(implUriBuf), implUriBuf.byteLength,
    changetype<u32>(methodBuf), methodBuf.byteLength,
    changetype<u32>(args), args.byteLength
  );

  if (!success) {
    const errorLen = __wrap_subinvokeImplementation_error_len();
    const messageBuf = new ArrayBuffer(errorLen);
    __wrap_subinvokeImplementation_error(changetype<u32>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    return Result.Err<ArrayBuffer, string>(message);
  }

  const resultLen = __wrap_subinvokeImplementation_result_len();
  const resultBuffer = new ArrayBuffer(resultLen);
  __wrap_subinvokeImplementation_result(changetype<u32>(resultBuffer));

  return Result.Ok<ArrayBuffer, string>(resultBuffer);
}
