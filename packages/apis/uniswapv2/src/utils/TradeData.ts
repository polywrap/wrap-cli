import { Trade } from "../query/w3";
import { tokenEquals } from "../query";
import { ProcessedTrade } from "./ProcesssedTrade";

import { BigInt } from "as-bigint";

export class TradeData {
  trade: Trade;
  processedTrade: ProcessedTrade;

  constructor(trade: Trade, processedTrade: ProcessedTrade) {
    this.trade = trade;
    this.processedTrade = processedTrade;
  }

  // trades with higher output and lower input have highest priority
  static compare(a: TradeData, b: TradeData): i32 {
    const aInput = a.processedTrade.inputAmount;
    const bInput = b.processedTrade.inputAmount;
    if (tokenEquals({ token: aInput.token, other: bInput.token })) {
      throw new Error("To be compared, trades must the same input token");
    }
    const aOutput = a.processedTrade.outputAmount;
    const bOutput = b.processedTrade.outputAmount;
    if (tokenEquals({ token: aOutput.token, other: bOutput.token })) {
      throw new Error("To be compared, trades must the same output token");
    }
    const aOutputBI = BigInt.fromString(aOutput.amount);
    const bOutputBI = BigInt.fromString(bOutput.amount);
    const outCmp = aOutputBI.compareTo(bOutputBI);
    if (outCmp == 0) {
      const aInputBI = BigInt.fromString(aInput.amount);
      const bInputBI = BigInt.fromString(bInput.amount);
      const inCmp = aInputBI.compareTo(bInputBI);
      if (inCmp == 0) {
        return 0;
      } else if (inCmp < 0) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (outCmp > 0) {
        return 1;
      } else {
        return -1;
      }
    }
  }
}
