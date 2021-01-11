/* eslint-disable */

// Subquery API

@external("w3", "__w3_subquery")
export declare function __w3_subquery(
  uri_ptr: usize, uri_len: usize,
  query_ptr: usize, query_len: usize,
  args_ptr: usize, args_len: usize
): bool;

// Query Result
@external("w3", "__w3_subquery_result_len")
export declare function __w3_subquery_result_len(): usize;
@external("w3", "__w3_subquery_result")
export declare function __w3_subquery_result(ptr: usize): void;

// Query Error
@external("w3", "__w3_subquery_error_len")
export declare function __w3_subquery_error_len(): usize;
@external("w3", "__w3_subquery_error")
export declare function __w3_subquery_error(ptr: usize): void;

// Query API Helper
export function w3_subquery(
  uri: string,
  query: string,
  args: ArrayBuffer
): ArrayBuffer {
  const uriBuf = String.UTF8.encode(uri);
  const queryBuf = String.UTF8.encode(query);
  const success = __w3_subquery(
    changetype<usize>(uriBuf), uriBuf.byteLength,
    changetype<usize>(queryBuf), queryBuf.byteLength,
    changetype<usize>(args), args.byteLength
  );

  if (!success) {
    const errorLen = __w3_subquery_error_len();
    const messageBuf = new ArrayBuffer(changetype<usize>(errorLen));
    __w3_subquery_error(changetype<usize>(messageBuf));
    const message = String.UTF8.decode(messageBuf);
    throw new Error(message);
  }

  const resultLen = __w3_subquery_result_len();
  const resultBuffer = new ArrayBuffer(changetype<usize>(resultLen));
  __w3_subquery_result(changetype<usize>(resultBuffer));

  return resultBuffer;
}
