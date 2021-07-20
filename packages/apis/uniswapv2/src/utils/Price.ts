// translated to AS from https://github.com/Uniswap/uniswap-sdk-core/blob/main/src/entities/fractions/fraction.ts

import { Rounding, Token, TokenAmount } from "../query/w3";
import Fraction from "./Fraction";
import { tokenEquals } from "../query";

import { BigInt } from "@web3api/wasm-as";

export default class Price extends Fraction {
  public readonly baseToken: Token; // input i.e. denominator
  public readonly quoteToken: Token; // output i.e. numerator
  public readonly scalar: Fraction; // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(
    baseToken: Token,
    quoteToken: Token,
    denominator: BigInt,
    numerator: BigInt
  ) {
    super(numerator, denominator);

    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.scalar = new Fraction(
      BigInt.pow(BigInt.fromUInt16(10), baseToken.currency.decimals),
      BigInt.pow(BigInt.fromUInt16(10), quoteToken.currency.decimals)
    );
  }

  public raw(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }

  public adjusted(): Fraction {
    return super.mul(this.scalar);
  }

  public invert(): Price {
    return new Price(
      this.quoteToken,
      this.baseToken,
      this.numerator,
      this.denominator
    );
  }

  public mul(other: Price): Price {
    if (!tokenEquals({ token: this.quoteToken, other: other.baseToken }))
      throw new Error(
        "Price multiply error: quoteToken of 'left' must be the same as baseToken of 'right'"
      );
    const fraction = super.mul(other);
    return new Price(
      this.baseToken,
      other.quoteToken,
      fraction.denominator,
      fraction.numerator
    );
  }

  public quote(tokenAmount: TokenAmount): TokenAmount {
    if (!tokenEquals({ token: tokenAmount.token, other: this.baseToken })) {
      throw new Error("Token of tokenAmount must be the same as baseToken");
    }
    const biAmount = tokenAmount.amount;
    const res = super.mul(new Fraction(biAmount)).quotient();
    return {
      token: this.quoteToken,
      amount: res,
    };
  }

  public toSignificant(
    significantDigits: i32 = 6,
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    return this.adjusted().toSignificant(significantDigits, rounding);
  }

  public toFixed(
    decimalPlaces: i32 = 4,
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    return this.adjusted().toFixed(decimalPlaces, rounding);
  }
}
