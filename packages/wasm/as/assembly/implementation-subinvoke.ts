/* eslint-disable */
import { Result } from "./containers";

// Implementation Subinvoke API

@external("w3", "__w3_subinvokeImplementation")
export declare function __w3_subinvokeImplementation(
  interface_uri_ptr: u32, interface_uri_len: u32,
  impl_uri_ptr: u32, impl_uri_len: u32,
  module_ptr: u32, module_len: u32,
  method_ptr: u32, method_len: u32,
  input_ptr: u32, input_len: u32
): bool;

// Implementation Subinvoke Result
@external("w3", "__w3_subinvokeImplementation_result_len")
export declare function __w3_subinvokeImplementation_result_len(): u32;
@external("w3", "__w3_subinvokeImplementation_result")
export declare function __w3_subinvokeImplementation_result(ptr: u32): void;

// Subinvoke Error
@external("w3", "__w3_subinvokeImplementation_error_len")
export declare function __w3_subinvokeImplementation_error_len(): u32;
@external("w3", "__w3_subinvokeImplementation_error")
export declare function __w3_subinvokeImplementation_error(ptr: u32): void;

// Implementation Subinvoke API Helper
export function w3_subinvokeImplementation(
  interfaceUri: string,
  implUri: string,
  module: string,
  method: string,
  input: ArrayBuffer
): Result<ArrayBuffer, string> {
  const interfaceUriBuf = String.UTF8.encode(interfaceUri);
  const implUriBuf = String.UTF8.encode(implUri);
  const moduleBuf = String.UTF8.encode(module);
  const methodBuf = String.UTF8.encode(method);
  
  const success = __w3_subinvokeImplementation(
    changetype<u32>(interfaceUriBuf), interfaceUriBuf.byteLength,
    changetype<u32>(implUriBuf), implUriBuf.byteLength,
    changetype<u32>(moduleBuf), moduleBuf.byteLength,
    changetype<u32>(methodBuf), methodBuf.byteLength,
    changetype<u32>(input), input.byteLength
  );

  if (!success) {
    const errorLen = __w3_subinvokeImplementation_error_len();
    const messageBuf = new ArrayBuffer(errorLen);
    __w3_subinvokeImplementation_error(changetype<u32>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    return Result.Err<ArrayBuffer, string>(message);
  }

  const resultLen = __w3_subinvokeImplementation_result_len();
  const resultBuffer = new ArrayBuffer(resultLen);
  __w3_subinvokeImplementation_result(changetype<u32>(resultBuffer));

  return Result.Ok<ArrayBuffer, string>(resultBuffer);
}
