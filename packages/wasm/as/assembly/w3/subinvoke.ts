/* eslint-disable */

// Subinvoke API

@external("w3", "__w3_subinvoke")
export declare function __w3_subinvoke(
  uri_ptr: usize, uri_len: usize,
  module_ptr: usize, module_len: usize,
  method_ptr: usize, method_len: usize,
  input_ptr: usize, input_len: usize
): bool;

// Subinvoke Result
@external("w3", "__w3_subinvoke_result_len")
export declare function __w3_subinvoke_result_len(): usize;
@external("w3", "__w3_subinvoke_result")
export declare function __w3_subinvoke_result(ptr: usize): void;

// Subinvoke Error
@external("w3", "__w3_subinvoke_error_len")
export declare function __w3_subinvoke_error_len(): usize;
@external("w3", "__w3_subinvoke_error")
export declare function __w3_subinvoke_error(ptr: usize): void;

// Subinvoke API Helper
export function w3_subinvoke(
  uri: string,
  module: string,
  method: string,
  input: ArrayBuffer
): ArrayBuffer {
  const uriBuf = String.UTF8.encode(uri);
  const moduleBuf = String.UTF8.encode(module);
  const methodBuf = String.UTF8.encode(method);
  const success = __w3_subinvoke(
    changetype<usize>(uriBuf), uriBuf.byteLength,
    changetype<usize>(moduleBuf), moduleBuf.byteLength,
    changetype<usize>(methodBuf), methodBuf.byteLength,
    changetype<usize>(input), input.byteLength
  );

  if (!success) {
    const errorLen = __w3_subinvoke_error_len();
    const messageBuf = new ArrayBuffer(changetype<usize>(errorLen));
    __w3_subinvoke_error(changetype<usize>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    throw new Error(message);
  }

  const resultLen = __w3_subinvoke_result_len();
  const resultBuffer = new ArrayBuffer(changetype<usize>(resultLen));
  __w3_subinvoke_result(changetype<usize>(resultBuffer));

  return resultBuffer;
}
