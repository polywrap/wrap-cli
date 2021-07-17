/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/naming-convention */
@external("w3", "__w3_log")
export declare function __w3_log(msgPtr: u32, msgLen: u32): void;

export function w3Log(value: string): void {
  const valueBuf = String.UTF8.encode(value);
  __w3_log(changetype<u32>(valueBuf), valueBuf.byteLength);
}