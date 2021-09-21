import { BigInt } from "as-bigint";

import Fraction from "../../utils/Fraction";

describe('Fraction', () => {
  describe('qoutient', () => {
    test("floor division", () => {
      expect(
        new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).quotient()
      ).toBe(BigInt.fromUInt16(2))

      expect(
        new Fraction(BigInt.fromUInt16(12), BigInt.fromUInt16(4)).quotient()
      ).toBe(BigInt.fromUInt16(3))

      expect(
        new Fraction(BigInt.fromUInt16(16), BigInt.fromUInt16(5)).quotient()
      ).toBe(BigInt.fromUInt16(3))
    });
  });

  describe('invert', () => {
    test("flips num and denom", () => {
      const result = new Fraction(BigInt.fromUInt16(8), BigInt.fromUInt16(3)).invert()

      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(8))
      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(3))
    });
  });

  describe('add', () => {
    test("multiples denoms and adds nums", () => {
      const result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(10)
      ).add(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(52));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(120));
    });

    test("same denom", () => {
      const result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(5)
      ).add(
        new Fraction(
          BigInt.fromUInt16(2),
          BigInt.fromUInt16(5)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(3));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(5));
    });
  });

  describe('subtract', () => {
    test("multiples denoms and adds nums", () => {
      const result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(10)
      ).sub(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromString("-28"));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(120));
    });

    test("same denom", () => {
      const result = new Fraction(
        BigInt.fromUInt16(3),
        BigInt.fromUInt16(5)
      ).sub(
        new Fraction(
          BigInt.fromUInt16(2),
          BigInt.fromUInt16(5)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(1));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(5));
    });
  });

  describe('lt', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(10)
        ).lt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(true);

      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(3)
        ).lt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromUInt16(5),
          BigInt.fromUInt16(12)
        ).lt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);
    });
  });

  describe('eq', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(10)
        ).eq(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(3)
        ).eq(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(true);

      expect(
        new Fraction(
          BigInt.fromUInt16(5),
          BigInt.fromUInt16(12)
        ).eq(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);
    });
  });

  describe('gt', () => {
    test("correct", () => {
      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(10)
        ).gt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromUInt16(1),
          BigInt.fromUInt16(3)
        ).gt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(false);

      expect(
        new Fraction(
          BigInt.fromUInt16(5),
          BigInt.fromUInt16(12)
        ).gt(
          new Fraction(
            BigInt.fromUInt16(4),
            BigInt.fromUInt16(12)
          )
        )
      ).toBe(true);
    });
  });

  describe('mul', () => {
    test("correct", () => {
      let result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(10)
      ).mul(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(4));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(120));

      result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(3)
      ).mul(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(4));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(36));

      result = new Fraction(
        BigInt.fromUInt16(5),
        BigInt.fromUInt16(12)
      ).mul(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(20));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(144));
    });
  });

  describe('div', () => {
    test("correct", () => {
      let result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(10)
      ).div(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(12));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(40));

      result = new Fraction(
        BigInt.fromUInt16(1),
        BigInt.fromUInt16(3)
      ).div(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(12));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(12));

      result = new Fraction(
        BigInt.fromUInt16(5),
        BigInt.fromUInt16(12)
      ).div(
        new Fraction(
          BigInt.fromUInt16(4),
          BigInt.fromUInt16(12)
        )
      );

      expect(result.numerator).toStrictEqual(BigInt.fromUInt16(60));
      expect(result.denominator).toStrictEqual(BigInt.fromUInt16(48));
    });
  });

  describe('fromString', () => {
    test("correct", () => {
      let fraction = Fraction.fromString("0.05");

      expect(fraction.numerator).toStrictEqual(BigInt.fromUInt16(5));
      expect(fraction.denominator).toStrictEqual(BigInt.fromUInt16(100));

      fraction = Fraction.fromString("0.5");

      expect(fraction.numerator).toStrictEqual(BigInt.fromUInt16(5));
      expect(fraction.denominator).toStrictEqual(BigInt.fromUInt16(10));

      fraction = Fraction.fromString("0.0001");

      expect(fraction.numerator).toStrictEqual(BigInt.fromUInt16(1));
      expect(fraction.denominator).toStrictEqual(BigInt.fromUInt16(10000));

      fraction = Fraction.fromString("0");

      expect(fraction.numerator).toStrictEqual(BigInt.fromUInt16(0));
      expect(fraction.denominator).toStrictEqual(BigInt.fromUInt16(1));

      fraction = Fraction.fromString("2");

      expect(fraction.numerator).toStrictEqual(BigInt.fromUInt16(2));
      expect(fraction.denominator).toStrictEqual(BigInt.fromUInt16(1));
    });
  });
})
