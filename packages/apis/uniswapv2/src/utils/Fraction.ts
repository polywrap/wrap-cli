// translated to AS from https://github.com/Uniswap/uniswap-sdk-core/blob/main/src/entities/fractions/fraction.ts

import { BigInt } from "./BigInt";

export default class Fraction {
  public readonly numerator: BigInt;
  public readonly denominator: BigInt;

  public constructor(numerator: BigInt, denominator: BigInt = BigInt.ONE) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  // performs floor division
  public quotient(): BigInt {
    return BigInt.div(this.numerator, this.denominator);
  }

  // remainder after floor division
  // public get remainder(): Fraction {
  //   return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator)
  // }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  public add(other: Fraction): Fraction {
    if (this.denominator.eq(other.denominator)) {
      const numeratorSum: BigInt = BigInt.add(this.numerator, other.numerator);
      return new Fraction(numeratorSum, this.denominator);
    }
    return new Fraction(
      BigInt.add(
        BigInt.mul(this.numerator, other.denominator),
        BigInt.mul(other.numerator, this.denominator)
      ),
      BigInt.mul(this.denominator, other.denominator)
    );
  }

  public sub(other: Fraction): Fraction {
    if (BigInt.eq(this.denominator, other.denominator)) {
      const numeratorSub: BigInt = BigInt.sub(this.numerator, other.numerator);
      return new Fraction(numeratorSub, this.denominator)
    }
    return new Fraction(
      BigInt.sub(
        BigInt.mul(this.numerator, other.denominator),
        BigInt.mul(other.numerator, this.denominator)
      ),
      BigInt.mul(this.denominator, other.denominator)
    );
  }

  public lt(other: Fraction): boolean {
    return BigInt.lt(
      BigInt.mul(this.numerator, other.denominator),
      BigInt.mul(other.numerator, this.denominator)
    );
  }

  public eq(other: Fraction): boolean {
    return BigInt.eq(
      BigInt.mul(this.numerator, other.denominator),
      BigInt.mul(other.numerator, this.denominator)
    );
  }

  public gt(other: Fraction): boolean {
    return BigInt.gt(
      BigInt.mul(this.numerator, other.denominator),
      BigInt.mul(other.numerator, this.denominator)
    );
  }

  public mul(other: Fraction): Fraction {
    return new Fraction(
      BigInt.mul(this.numerator, other.numerator),
      BigInt.mul(this.denominator, other.denominator)
    );
  }

  public div(other: Fraction): Fraction {
    return new Fraction(
      BigInt.mul(this.numerator, other.denominator),
      BigInt.mul(this.denominator, other.numerator)
    );
  }

  // public toSignificant(
  //   significantDigits: number,
  //   format: object = { groupSeparator: '' },
  //   rounding: Rounding = Rounding.ROUND_HALF_UP
  // ): string {
  //   invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`)
  //   invariant(significantDigits > 0, `${significantDigits} is not positive.`)
  //
  //   Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
  //   const quotient = new Decimal(this.numerator.toString())
  //     .div(this.denominator.toString())
  //     .toSignificantDigits(significantDigits)
  //   return quotient.toFormat(quotient.decimalPlaces(), format)
  // }
  //
  // public toFixed(
  //   decimalPlaces: number,
  //   format: object = { groupSeparator: '' },
  //   rounding: Rounding = Rounding.ROUND_HALF_UP
  // ): string {
  //   invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
  //   invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)
  //
  //   Big.DP = decimalPlaces
  //   Big.RM = toFixedRounding[rounding]
  //   return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format)
  // }
}