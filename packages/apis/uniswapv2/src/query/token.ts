import {
  Input_tokenEquals,
  Input_tokenSortsBefore,
  Token,
  TokenAmount,
} from "./w3";

import { BigInt } from "as-bigint";

// Checks if the current instance is equal to another (has an identical chainId and address).
export function tokenEquals(input: Input_tokenEquals): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.chainId === other.chainId && token.address === other.address;
}

// compares two TokenAmount types for equality, returning true if they have the
// same token and same amount
export function tokenAmountEquals(input: Input_tokenAmountEquals): boolean {
  const amt0: TokenAmount = input.tokenAmount0;
  const amt1: TokenAmount = input.tokenAmount1;
  return (
    tokenEquals({ token: amt0.token, other: amt1.token }) &&
    BigInt.fromString(amt0.amount).eq(BigInt.fromString(amt1.amount))
  );
}

// Checks if the current instance sorts before another, by address.
export function tokenSortsBefore(input: Input_tokenSortsBefore): boolean {
  const token: Token = input.token;
  const other: Token = input.other;
  return token.address.localeCompare(other.address) < 0;
}
