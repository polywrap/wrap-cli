import { Input_tokenEquals, Input_tokenSortsBefore, Token } from "./w3";

// Checks if the current instance is equal to another (has an identical chainId and address).
export function tokenEquals(input: Input_tokenEquals): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.chainId === other.chainId && token.address === other.address
}

// Checks if the current instance sorts before another, by address.
export function tokenSortsBefore(input: Input_tokenSortsBefore): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.address.localeCompare(other.address) < 0;
}