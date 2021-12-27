/* eslint-disable */

// Load environment variables
@external("w3", "__w3_load_env")
export declare function __w3_load_env(enviroment_ptr: u32): void;

export function w3_load_env(environment_size: u32): ArrayBuffer {
  const environmentBuf = new ArrayBuffer(environment_size);
  __w3_load_env(changetype<u32>(environmentBuf));
  return environmentBuf;
}
