import { BigInt } from "as-bigint";

import Fraction from "../../utils/Fraction";

describe('Fraction', () => {
  describe('qoutient', () => {
    test("floor division", () => {
      expect(
        new Fraction(BigInt.fromInt(8), BigInt.fromInt(3)).quotient()
      ).toBe(BigInt.fromInt(2))

      expect(
        new Fraction(BigInt.fromInt(12), BigInt.fromInt(4)).quotient()
      ).toBe(BigInt.fromInt(3))

      expect(
        new Fraction(BigInt.fromInt(16), BigInt.fromInt(5)).quotient()
      ).toBe(BigInt.fromInt(3))
    });
  });

  describe('invert', () => {
    test("flips num and denom", () => {
      const result = new Fraction(BigInt.fromInt(8), BigInt.fromInt(3)).invert()

      expect(result.denominator).toStrictEqual(BigInt.fromInt(8))
      expect(result.numerator).toStrictEqual(BigInt.fromInt(3))
    });
  });

  describe('add', () => {
    test("multiples denoms and adds nums", () => {
      const result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(10)
      ).add(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(52));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(120));
    });

    test("same denom", () => {
      const result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(5)
      ).add(
        new Fraction(
          BigInt.fromInt(2),
          BigInt.fromInt(5)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(3));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(5));
    });
  });

  describe('subtract', () => {
    test("multiples denoms and adds nums", () => {
      const result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(10)
      ).sub(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(-28));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(120));
    });

    test("same denom", () => {
      const result = new Fraction(
        BigInt.fromInt(3),
        BigInt.fromInt(5)
      ).sub(
        new Fraction(
          BigInt.fromInt(2),
          BigInt.fromInt(5)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(1));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(5));
    });
  });

  describe('lt', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(10)
        ).lt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(true);

      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(3)
        ).lt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromInt(5),
          BigInt.fromInt(12)
        ).lt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);
    });
  });

  describe('eq', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(10)
        ).eq(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(3)
        ).eq(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(true);

      expect(
        new Fraction(
          BigInt.fromInt(5),
          BigInt.fromInt(12)
        ).eq(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);
    });
  });

  describe('gt', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(10)
        ).gt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromInt(1),
          BigInt.fromInt(3)
        ).gt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromInt(5),
          BigInt.fromInt(12)
        ).gt(
          new Fraction(
            BigInt.fromInt(4),
            BigInt.fromInt(12)
          )
        )
      ).toBe(true);
    });
  });

  describe('mul', () => {
    test("correct", () => {
      let result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(10)
      ).mul(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(4));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(120));

      result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(3)
      ).mul(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(4));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(36));

      result = new Fraction(
        BigInt.fromInt(5),
        BigInt.fromInt(12)
      ).mul(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(20));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(144));
    });
  });

  describe('div', () => {
    test("correct", () => {
      let result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(10)
      ).div(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(12));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(40));

      result = new Fraction(
        BigInt.fromInt(1),
        BigInt.fromInt(3)
      ).div(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(12));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(12));

      result = new Fraction(
        BigInt.fromInt(5),
        BigInt.fromInt(12)
      ).div(
        new Fraction(
          BigInt.fromInt(4),
          BigInt.fromInt(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromInt(60));
      expect(result.denominator).toStrictEqual(BigInt.fromInt(48));
    });
  });

  describe('fromString', () => {
    test("correct", () => {
      let fraction = Fraction.fromString("0.05");

      expect(fraction.numerator).toStrictEqual(BigInt.fromInt(5));
      expect(fraction.denominator).toStrictEqual(BigInt.fromInt(100));

      fraction = Fraction.fromString("0.5");

      expect(fraction.numerator).toStrictEqual(BigInt.fromInt(5));
      expect(fraction.denominator).toStrictEqual(BigInt.fromInt(10));

      fraction = Fraction.fromString("0.0001");

      expect(fraction.numerator).toStrictEqual(BigInt.fromInt(1));
      expect(fraction.denominator).toStrictEqual(BigInt.fromInt(10000));

      fraction = Fraction.fromString("0");

      expect(fraction.numerator).toStrictEqual(BigInt.fromInt(0));
      expect(fraction.denominator).toStrictEqual(BigInt.fromInt(1));

      fraction = Fraction.fromString("2");

      expect(fraction.numerator).toStrictEqual(BigInt.fromInt(2));
      expect(fraction.denominator).toStrictEqual(BigInt.fromInt(1));
    });
  });
})
