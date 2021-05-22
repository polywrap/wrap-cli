import { Pair, Token, TokenAmount } from "../query/w3";
import { tokenEquals } from "../query";
import { wrapIfEther } from "./utils";

import { BigInt } from "@web3api/wasm-as";

export class ProcessedPair {
  amount: TokenAmount;
  nextPair: Pair;

  private constructor(amount: TokenAmount, nextPair: Pair) {
    this.amount = amount;
    this.nextPair = nextPair;
  }

  static pairOutputForExactInput(
    pair: Pair,
    tradeTokenAmount: TokenAmount
  ): ProcessedPair {
    const tradeAmount = tradeTokenAmount.amount;
    if (tradeAmount.isZero()) {
      throw new RangeError(
        "Insufficient input amount: Input amount must be greater than zero"
      );
    }
    if (
      pair.tokenAmount0.amount.isZero() ||
      pair.tokenAmount1.amount.isZero()
    ) {
      throw new RangeError(
        "Insufficient liquidity: Pair reserves must be greater than zero"
      );
    }
    // make sure input and output tokens are correctly assigned
    let inTokenAmount: TokenAmount;
    let outTokenAmount: TokenAmount;
    const wrappedTradeToken: Token = wrapIfEther(tradeTokenAmount.token);
    if (
      tokenEquals({
        token: wrapIfEther(pair.tokenAmount0.token),
        other: wrappedTradeToken,
      })
    ) {
      inTokenAmount = pair.tokenAmount0;
      outTokenAmount = pair.tokenAmount1;
    } else if (
      tokenEquals({
        token: wrapIfEther(pair.tokenAmount1.token),
        other: wrappedTradeToken,
      })
    ) {
      inTokenAmount = pair.tokenAmount1;
      outTokenAmount = pair.tokenAmount0;
    } else {
      throw new Error("Input token must be a member of the pair");
    }
    // calculate
    const biInTokenAmt: BigInt = inTokenAmount.amount;
    const biOutTokenAmt: BigInt = outTokenAmount.amount;
    const amountInWithFee: BigInt = tradeAmount.mul(BigInt.fromUInt16(997));
    const numerator: BigInt = amountInWithFee.mul(biOutTokenAmt);
    const denominator: BigInt = biInTokenAmt
      .mul(BigInt.fromUInt16(1000))
      .add(amountInWithFee);
    const output = numerator.div(denominator);
    // instantiate results
    const resultAmount: TokenAmount = {
      token: outTokenAmount.token,
      amount: output,
    };
    const resultInputTokenAmount: TokenAmount = {
      token: inTokenAmount.token,
      amount: biInTokenAmt.add(tradeAmount),
    };
    const resultOutputTokenAmount: TokenAmount = {
      token: outTokenAmount.token,
      amount: biOutTokenAmt.sub(output),
    };
    // return results
    if (pair.tokenAmount0.token.address == inTokenAmount.token.address) {
      return new ProcessedPair(resultAmount, {
        tokenAmount0: resultInputTokenAmount,
        tokenAmount1: resultOutputTokenAmount,
      });
    } else {
      return new ProcessedPair(resultAmount, {
        tokenAmount0: resultOutputTokenAmount,
        tokenAmount1: resultInputTokenAmount,
      });
    }
  }

  public static pairInputForExactOutput(
    pair: Pair,
    tradeTokenAmount: TokenAmount
  ): ProcessedPair {
    const tradeAmount = tradeTokenAmount.amount;
    if (tradeAmount.isZero()) {
      throw new RangeError(
        "Insufficient output amount: Output amount must be greater than zero"
      );
    }
    if (
      pair.tokenAmount0.amount.isZero() ||
      pair.tokenAmount1.amount.isZero()
    ) {
      throw new RangeError(
        "Insufficient liquidity: Pair reserves must be greater than zero"
      );
    }
    // make sure input and output tokens are correctly assigned
    let inTokenAmount: TokenAmount;
    let outTokenAmount: TokenAmount;
    const wrappedTradeToken: Token = wrapIfEther(tradeTokenAmount.token);
    if (
      tokenEquals({
        token: wrapIfEther(pair.tokenAmount0.token),
        other: wrappedTradeToken,
      })
    ) {
      outTokenAmount = pair.tokenAmount0;
      inTokenAmount = pair.tokenAmount1;
    } else if (
      tokenEquals({
        token: wrapIfEther(pair.tokenAmount1.token),
        other: wrappedTradeToken,
      })
    ) {
      outTokenAmount = pair.tokenAmount1;
      inTokenAmount = pair.tokenAmount0;
    } else {
      throw new Error("Output token must be a member of the pair");
    }
    // calculate
    const biInTokenAmt = inTokenAmount.amount;
    const biOutTokenAmt = outTokenAmount.amount;
    const numerator: BigInt = biInTokenAmt
      .mul(tradeAmount)
      .mul(BigInt.fromUInt16(1000));
    const denominator: BigInt = biOutTokenAmt
      .sub(tradeAmount)
      .mul(BigInt.fromUInt16(997));
    const input: BigInt = numerator.div(denominator).add(BigInt.fromUInt16(1));
    // instantiate results
    const resultAmount: TokenAmount = {
      token: inTokenAmount.token,
      amount: input,
    };
    const resultInputTokenAmount: TokenAmount = {
      token: inTokenAmount.token,
      amount: biInTokenAmt.add(input),
    };
    const resultOutputTokenAmount: TokenAmount = {
      token: outTokenAmount.token,
      amount: biOutTokenAmt.sub(tradeAmount),
    };
    // return results
    if (pair.tokenAmount0.token.address == inTokenAmount.token.address) {
      return new ProcessedPair(resultAmount, {
        tokenAmount0: resultInputTokenAmount,
        tokenAmount1: resultOutputTokenAmount,
      });
    } else {
      return new ProcessedPair(resultAmount, {
        tokenAmount0: resultOutputTokenAmount,
        tokenAmount1: resultInputTokenAmount,
      });
    }
  }
}
