/* eslint-disable */

// Load Env Variables
@external("wrap", "__wrap_load_env")
export declare function __wrap_load_env(enviroment_ptr: u32): void;

export function wrap_load_env(env_size: u32): ArrayBuffer {
  const envBuf = new ArrayBuffer(env_size);
  __wrap_load_env(changetype<u32>(envBuf));
  return envBuf;
}
