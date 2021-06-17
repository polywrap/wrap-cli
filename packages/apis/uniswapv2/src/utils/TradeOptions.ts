import { BestTradeOptions } from "../query/w3";

export class TradeOptions {
  maxNumResults: u32;
  maxHops: u32;

  constructor(options: BestTradeOptions | null) {
    if (options == null) {
      this.maxNumResults = 3;
      this.maxHops = 3;
    } else {
      this.maxNumResults = options.maxNumResults.isNull ? 3 : options.maxNumResults.value;
      this.maxHops = options.maxHops.isNull ? 3 : options.maxHops.value;
    }
  }
}
