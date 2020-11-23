// Query API
@external("w3", "__w3_query")
export declare function __w3_query(
  uri_ptr: i32, uri_len: usize,
  query_ptr: i32, query_len: usize,
  args_ptr: i32, args_len: usize
): bool;

// Query Result
@external("w3", "__w3_query_result_len")
export declare function __w3_query_result_len(): usize;
@external("w3", "__w3_query_result")
export declare function __w3_query_result(ptr: i32): void;

// Query Error
@external("w3", "__w3_query_error_len")
export declare function __w3_query_error_len(): usize;
@external("w3", "__w3_query_error")
export declare function __w3_query_error(ptr: i32): void;

// Query API Helper
export function w3_query(
  uri: string,
  query: string,
  args: ArrayBuffer
): ArrayBuffer {
  const uriBuf = String.UTF8.encode(uri);
  const queryBuf = String.UTF8.encode(query);
  const success = __w3_query(
    changetype<i32>(uriBuf), uriBuf.byteLength,
    changetype<i32>(queryBuf), queryBuf.byteLength,
    changetype<i32>(args), args.byteLength
  );

  if (!success) {
    const errorLen = __w3_query_error_len();
    const messageBuf = new ArrayBuffer(changetype<i32>(errorLen));
    __w3_query_error(changetype<i32>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    throw new Error(message);
  }

  const resultLen = __w3_query_result_len();
  const resultBuffer = new ArrayBuffer(changetype<i32>(resultLen));
  __w3_query_result(changetype<i32>(resultBuffer));

  return resultBuffer;
}
