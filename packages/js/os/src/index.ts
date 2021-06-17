export * from "./fs";

export function isWin(): boolean {
  return process.platform === "win32";
}
