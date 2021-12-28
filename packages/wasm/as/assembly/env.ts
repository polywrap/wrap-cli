/* eslint-disable */

// Load env variables
@external("w3", "__w3_load_env")
export declare function __w3_load_env(enviroment_ptr: u32): void;

export function w3_load_env(env_size: u32): ArrayBuffer {
  const envBuf = new ArrayBuffer(env_size);
  __w3_load_env(changetype<u32>(envBuf));
  return envBuf;
}
