// based on https://cp-algorithms.com/algebra/big-integer.html

export class BigInt {
  public static ZERO: BigInt = BigInt.fromDigits([0]);
  public static ONE: BigInt = BigInt.fromDigits([1]);

  public readonly isNegative: boolean;
  private readonly _d: u32[] = []; // digits stored from least to most significant
  private readonly _e: i32 = 9;
  private readonly _base: u32 = 10 ** <u32>this._e;

  private constructor(bigNumber: string) {
    // TODO: check that input represents an integer. parseInt returns 0 on invalid input; no regex in AS; maybe use ascii?
    // check sign
    if (bigNumber.length >= 1 && bigNumber.charAt(0) == "-") {
      this.isNegative = true;
      bigNumber = bigNumber.substring(1);
    }
    // parse string in baseE-digit segments
    for (let i = bigNumber.length; i > 0; i -= this._e) {
      let digitStr: string;
      if (i < this._e) {
        digitStr = bigNumber.substring(0, i);
      } else {
        digitStr = bigNumber.substring(i - this._e, i);
      }
      this._d.push(U32.parseInt(digitStr));
    }
    // remove any leading zeros
    this.trimLeadingZeros();
  }

  static fromString(bigNumber: string): BigInt {
    // prevent negative empty array
    if (bigNumber.length == 1 && bigNumber.charAt(0) == "-") {
      bigNumber = "0";
    }
    // prevent negative zero
    if (bigNumber == "-0") {
      bigNumber = "0";
    }
    return new BigInt(bigNumber);
  }

  static fromDigits(digits: u32[], isNegative: boolean = false): BigInt {
    // prevent negative empty array
    if (digits.length == 0) {
      return new BigInt("0");
    }
    // prevent negative zero
    if (digits.length == 1 && digits[0] == 0) {
      return new BigInt("0");
    }
    const res = new BigInt(isNegative ? "-" : "");
    for (let i = 0; i < digits.length; i++) {
      res._d.push(digits[i]);
    }
    return res.trimLeadingZeros();
  }

  static fromInt(value: i64): BigInt {
    return BigInt.fromString(value.toString());
  }

  // O(N)
  copy(): BigInt {
    return BigInt.fromDigits(this._d, this.isNegative);
  }

  // O(N)
  opposite(): BigInt {
    return BigInt.fromDigits(this._d, !this.isNegative);
  }

  // O(N)
  @operator("+")
  add(other: BigInt): BigInt {
    if (this.isNegative && !other.isNegative) {
      return other.sub(this.opposite());
    } else if (!this.isNegative && other.isNegative) {
      return this.sub(other.opposite());
    }
    const res: BigInt = this.copy();
    let carry: bool = 0;
    const n = Math.max(res._d.length, other._d.length);
    for (let i = 0; i < n || carry; i++) {
      if (i == res._d.length) {
        res._d.push(0);
      }
      res._d[i] += carry + (i < other._d.length ? other._d[i] : 0);
      carry = res._d[i] >= res._base ? 1 : 0;
      if (carry) {
        res._d[i] -= res._base;
      }
    }
    return res;
  }

  static add(left: BigInt, right: BigInt): BigInt {
    return left.add(right);
  }

  // O(N)
  @operator("-")
  sub(other: BigInt): BigInt {
    if (this.isNegative && other.isNegative) {
      return other.opposite().sub(this.opposite());
    } else if (!this.isNegative && other.isNegative) {
      return this.add(other.opposite());
    } else if (this.isNegative && !other.isNegative) {
      return this.add(other.opposite());
    }
    const cmp: i8 = this.compareTo(other);
    if (cmp < 0) {
      return other.sub(this).opposite();
    } else if (cmp == 0) {
      return BigInt.ZERO;
    }
    const res: BigInt = this.copy();
    let carry: bool = 0;
    for (let i = 0; i < other._d.length || carry; i++) {
      const subVal: i64 = <i64>(i < other._d.length ? other._d[i] : 0);
      const val: i64 = <i64>res._d[i] - carry - subVal;
      carry = val < 0 ? 1 : 0;
      if (carry) {
        res._d[i] = <u32>(val + res._base);
      } else {
        res._d[i] = <u32>val;
      }
    }
    return res.trimLeadingZeros();
  }

  static sub(left: BigInt, right: BigInt): BigInt {
    return left.sub(right);
  }

  // TODO: add mulInt function for performance optimization
  // O(N^2) -- this is the "school book" algorithm, which mimics the way we learn to do multiplication by hand as children
  // Although it is O(N^2), it is faster in practice than asymptotically better algorithms for multiplicands of <= 256 bits
  @operator("*")
  mul(other: BigInt): BigInt {
    const res: u32[] = new Array<u32>(this._d.length + other._d.length);
    for (let i = 0; i < this._d.length; i++) {
      let carry: u32 = 0;
      for (let j = 0; j < other._d.length || carry; j++) {
        if (j >= other._d.length) {
          res.push(0);
        }
        const otherVal = j < other._d.length ? other._d[j] : 0;
        const cur: u64 = res[i + j] + <u64>this._d[i] * otherVal + carry;
        res[i + j] = <u32>(cur % this._base);
        carry = <u32>(cur / this._base);
      }
    }
    return BigInt.fromDigits(res, this.isNegative != other.isNegative);
  }

  static mul(left: BigInt, right: BigInt): BigInt {
    return left.mul(right);
  }

  // using binary search -> ~O(logZ*N^2) where Z is the magnitude of the numerator
  // idea pulled from https://github.com/achyutb6/big-integer-arithmetic/blob/master/src/aab180004/Num.java
  @operator("/")
  div(other: BigInt): BigInt {
    if (other.eq(BigInt.ZERO)) throw new RangeError("Divide by zero");
    if (other.gt(this)) return BigInt.ZERO;
    if (other._d.length == 1) return this.divInt(other._d[0]);

    let lo: BigInt = BigInt.ZERO;
    let hi: BigInt = this.copy();
    // TODO: can I improve lower bounds? for BigInt division?
    // improve bounds to improve performance
    for (let i = other._d.length; i > 1; i--) {
      hi._d.pop();
    }
    // search
    while (lo.lte(hi)) {
      const mid: BigInt = hi.sub(lo).divInt(2).add(lo);
      const cmp: i8 = this.compareTo(other.mul(mid));
      if (cmp < 0) hi = mid.sub(BigInt.ONE);
      else if (cmp > 0) lo = mid.add(BigInt.ONE);
      else return mid;
    }
    return lo.sub(BigInt.ONE);
  }

  static div(left: BigInt, right: BigInt): BigInt {
    return left.div(right);
  }

  // O(N)
  divInt(other: i32): BigInt {
    if (other == 0) throw new RangeError("Divide by zero");
    const res = BigInt.fromDigits(this._d, this.isNegative != other < 0);
    let carry: u64 = 0;
    for (let i = res._d.length - 1; i >= 0; i--) {
      const cur: u64 = res._d[i] + carry * res._base;
      res._d[i] = <u32>(cur / other);
      carry = cur % other;
    }
    return res.trimLeadingZeros();
  }

  // O(N)
  modInt(other: i32): u64 {
    if (other == 0) throw new RangeError("Divide by zero");
    const res = BigInt.fromDigits(this._d, this.isNegative != other < 0);
    let carry: u64 = 0;
    for (let i = res._d.length - 1; i >= 0; i--) {
      const cur: u64 = res._d[i] + carry * res._base;
      res._d[i] = <u32>(cur / other);
      carry = cur % other;
    }
    return carry;
  }

  // Babylonian method (as used in Uniswap contracts)
  // eslint-disable-next-line @typescript-eslint/member-ordering
  sqrt(): BigInt {
    const one = BigInt.ONE;
    const three = BigInt.fromDigits([3]);
    let z: BigInt = BigInt.ZERO;
    if (this.gt(three)) {
      z = this;
      let x: BigInt = this.divInt(2).add(one);
      while (x.lt(z)) {
        z = x;
        x = this.div(x).add(x).divInt(2);
      }
    } else if (!this.eq(BigInt.ZERO)) {
      z = one;
    }
    return z;
  }

  static sqrt(y: BigInt): BigInt {
    return y.sqrt();
  }

  pow(exponent: u64): BigInt {
    let res: BigInt = this.copy();
    for (let i: u64 = 1; i < exponent; i++) {
      res = res.mul(res);
    }
    return res;
  }

  static pow(base: BigInt, exponent: u64): BigInt {
    return base.pow(exponent);
  }

  @operator("==")
  eq(other: BigInt): boolean {
    return this.compareTo(other) == 0;
  }

  static eq(left: BigInt, right: BigInt): boolean {
    return left.eq(right);
  }

  @operator("!=")
  ne(other: BigInt): boolean {
    return !this.eq(other);
  }

  static ne(left: BigInt, right: BigInt): boolean {
    return left.ne(right);
  }

  @operator("<")
  lt(other: BigInt): boolean {
    return this.compareTo(other) < 0;
  }

  static lt(left: BigInt, right: BigInt): boolean {
    return left.lt(right);
  }

  @operator("<=")
  lte(other: BigInt): boolean {
    return this.compareTo(other) <= 0;
  }

  static lte(left: BigInt, right: BigInt): boolean {
    return left.lte(right);
  }

  @operator(">")
  gt(other: BigInt): boolean {
    return this.compareTo(other) > 0;
  }

  static gt(left: BigInt, right: BigInt): boolean {
    return left.gt(right);
  }

  @operator(">=")
  gte(other: BigInt): boolean {
    return this.compareTo(other) >= 0;
  }

  static gte(left: BigInt, right: BigInt): boolean {
    return left.gte(right);
  }

  compareTo(other: BigInt): i8 {
    // opposite signs
    if (this.isNegative && !other.isNegative) return -1;
    if (!this.isNegative && other.isNegative) return 1;
    // different number of "digits"
    if (this._d.length != other._d.length) {
      if (this._d.length > other._d.length && !this.isNegative) return 1;
      else if (other._d.length > this._d.length && !this.isNegative) return -1;
      else if (this._d.length > other._d.length && this.isNegative) return -1;
      else return 1;
    }
    // numbers are same length, so check each "digit"
    for (let i = this._d.length - 1; i >= 0; i--) {
      if (this._d[i] < other._d[i]) return -1;
      if (this._d[i] > other._d[i]) return 1;
    }
    return 0;
  }

  // O(N)
  toString(): string {
    if (this._d.length == 0) return "0";
    let res = this.isNegative ? "-" : "";
    res += this._d[this._d.length - 1].toString();
    for (let i = this._d.length - 2; i >= 0; i--) {
      res += this._d[i].toString().padStart(this._e, "0");
    }
    return res;
  }

  private trimLeadingZeros(): BigInt {
    while (this._d.length > 1 && this._d[this._d.length - 1] == 0) {
      this._d.pop();
    }
    return this;
  }
}
