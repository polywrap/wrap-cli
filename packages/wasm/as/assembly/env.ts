/* eslint-disable */
import { InvokeFunction } from "./invoke";

// Load Env Variables
@external("wrap", "__wrap_load_env")
export declare function __wrap_load_env(enviroment_ptr: u32): void;

// Get Sanitize Env Arguments
@external("wrap", "__wrap_sanitize_env_args")
export declare function __wrap_sanitize_env_args(args_ptr: u32): void;

// Set Sanitize Env Result
@external("wrap", "__wrap_sanitize_env_result")
export declare function __wrap_sanitize_env_result(ptr: u32, len: u32): void;

export function wrap_load_env(env_size: u32): ArrayBuffer {
  const envBuf = new ArrayBuffer(env_size);
  __wrap_load_env(changetype<u32>(envBuf));
  return envBuf;
}

export function wrap_sanitize_env(args_size: u32, fn: InvokeFunction): void {
  const argsBuf = new ArrayBuffer(args_size);
  __wrap_sanitize_env_args(
    changetype<u32>(argsBuf)
  );

  const result = fn(argsBuf);
  __wrap_sanitize_env_result(
    changetype<u32>(result),
    result.byteLength
  );
}
