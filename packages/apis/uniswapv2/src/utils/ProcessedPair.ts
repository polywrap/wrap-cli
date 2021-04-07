import { Pair, TokenAmount } from "../query/w3";
import { tokenEquals } from "../query";

import { BigInt } from "as-bigint";

export class ProcessedPair {
  amount: TokenAmount;
  nextPair: Pair;

  private constructor(amount: TokenAmount, nextPair: Pair) {
    this.amount = amount;
    this.nextPair = nextPair;
  }

  static pairOutputFromExactInput(
    pair: Pair,
    tradeTokenAmount: TokenAmount
  ): ProcessedPair {
    const tradeAmount = BigInt.fromString(tradeTokenAmount.amount);
    if (tradeAmount.eq(BigInt.ZERO)) {
      throw new RangeError(
        "Insufficient input amount: Input amount must be greater than zero"
      );
    }
    if (
      BigInt.fromString(pair.tokenAmount0.amount).eq(BigInt.ZERO) ||
      BigInt.fromString(pair.tokenAmount1.amount).eq(BigInt.ZERO)
    ) {
      throw new RangeError(
        "Insufficient liquidity: Pair reserves must be greater than zero"
      );
    }
    let inTokenAmount: TokenAmount;
    let outTokenAmount: TokenAmount;
    if (
      tokenEquals({
        token: pair.tokenAmount0.token,
        other: tradeTokenAmount.token,
      })
    ) {
      inTokenAmount = pair.tokenAmount0;
      outTokenAmount = pair.tokenAmount1;
    } else {
      inTokenAmount = pair.tokenAmount1;
      outTokenAmount = pair.tokenAmount0;
    }
    const biInTokenAmt: BigInt = BigInt.fromString(inTokenAmount.amount);
    const biOutTokenAmt: BigInt = BigInt.fromString(outTokenAmount.amount);
    const amountInWithFee: BigInt = tradeAmount.mul(BigInt.fromString("997"));
    const numerator: BigInt = amountInWithFee.mul(biOutTokenAmt);
    const denominator: BigInt = biInTokenAmt
      .mul(BigInt.fromString("1000"))
      .add(amountInWithFee);
    const output = numerator.div(denominator);
    return new ProcessedPair(
      {
        token: outTokenAmount.token,
        amount: output.toString(),
      },
      {
        tokenAmount0: {
          token: inTokenAmount.token,
          amount: biInTokenAmt.add(tradeAmount).toString(),
        },
        tokenAmount1: {
          token: outTokenAmount.token,
          amount: biOutTokenAmt.sub(output).toString(),
        },
      }
    );
  }

  public static pairInputForExactOutput(
    pair: Pair,
    tradeTokenAmount: TokenAmount
  ): ProcessedPair {
    const tradeAmount = BigInt.fromString(tradeTokenAmount.amount);
    if (tradeAmount.eq(BigInt.ZERO)) {
      throw new RangeError(
        "Insufficient output amount: Output amount must be greater than zero"
      );
    }
    if (
      BigInt.fromString(pair.tokenAmount0.amount) == BigInt.ZERO ||
      BigInt.fromString(pair.tokenAmount1.amount) == BigInt.ZERO
    ) {
      throw new RangeError(
        "Insufficient liquidity: Pair reserves must be greater than zero"
      );
    }
    let inTokenAmount: TokenAmount;
    let outTokenAmount: TokenAmount;
    if (
      tokenEquals({
        token: pair.tokenAmount0.token,
        other: tradeTokenAmount.token,
      })
    ) {
      outTokenAmount = pair.tokenAmount0;
      inTokenAmount = pair.tokenAmount1;
    } else {
      outTokenAmount = pair.tokenAmount1;
      inTokenAmount = pair.tokenAmount0;
    }
    const biInTokenAmt = BigInt.fromString(inTokenAmount.amount);
    const biOutTokenAmt = BigInt.fromString(outTokenAmount.amount);
    const numerator: BigInt = biInTokenAmt
      .mul(tradeAmount)
      .mul(BigInt.fromString("1000"));
    const denominator: BigInt = biOutTokenAmt
      .sub(tradeAmount)
      .mul(BigInt.fromString("997"));
    const input: BigInt = numerator
      .div(denominator)
      .add(BigInt.fromString("1"));

    return new ProcessedPair(
      {
        token: inTokenAmount.token,
        amount: input.toString(),
      },
      {
        tokenAmount0: {
          token: inTokenAmount.token,
          amount: biInTokenAmt.add(input).toString(),
        },
        tokenAmount1: {
          token: outTokenAmount.token,
          amount: biOutTokenAmt.sub(tradeAmount).toString(),
        },
      }
    );
  }
}
