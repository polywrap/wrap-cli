/* eslint-disable */

import { InvokeFunction } from "./invoke";

// Load environment variables
@external("w3", "__w3_load_env")
export declare function __w3_load_env(enviroment_ptr: u32): void;

// Set Sanitize Environment Arguments
@external("w3", "__w3_sanitize_env_args")
export declare function __w3_sanitize_env_args(args_ptr: u32): void;

// Set Sanitize Environment Result
@external("w3", "__w3_sanitize_env_result")
export declare function __w3_sanitize_env_result(ptr: u32, len: u32): void;

// Helper for sanitizing module environment
export function w3_sanitize_env(args_size: u32, fn: InvokeFunction): void {
  const argsBuf = new ArrayBuffer(args_size);
  __w3_sanitize_env_args(
    changetype<u32>(argsBuf)
  );

  const result = fn(argsBuf);
  __w3_sanitize_env_result(
    changetype<u32>(result),
    result.byteLength
  );
}
