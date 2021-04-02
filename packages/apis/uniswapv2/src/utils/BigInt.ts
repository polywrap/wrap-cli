// based on https://cp-algorithms.com/algebra/big-integer.html

export class BigInt {
  public static ZERO: BigInt = BigInt.fromDigits([0]);

  public readonly isNegative: boolean;
  private readonly _d: i32[] = []; // digits stored from least to most significant
  private readonly _base: i32 = 1000 * 1000 * 1000; // 10^e
  private readonly _e: i32 = 9;

  constructor(bigNumber: string) {
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
      this._d.push(I32.parseInt(digitStr));
    }
    // remove any leading zeros
    this.trimLeadingZeros();
  }

  static fromString(bigNumber: string): BigInt {
    return new BigInt(bigNumber);
  }

  static fromDigits(bigNumber: i32[], isNegative: boolean = false): BigInt {
    const res = new BigInt(isNegative ? "-" : "");
    for (let i = 0; i < bigNumber.length; i++) {
      res._d.push(bigNumber[i]);
    }
    return res.trimLeadingZeros();
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

  // O(N)
  @operator("-")
  sub(other: BigInt): BigInt {
    if (this.isNegative && other.isNegative) {
      return other.opposite().sub(this.opposite());
    } else if (!this.isNegative && other.isNegative) {
      return this.add(other.opposite());
    } else if (this.isNegative && !other.isNegative) {
      return this.add(other.opposite());
    } else if (this.lt(other)) {
      return other.sub(this).opposite();
    }
    const res: BigInt = this.copy();
    let carry: bool = 0;
    for (let i = 0; i < other._d.length || carry; i++) {
      res._d[i] -= carry + (i < other._d.length ? other._d[i] : 0);
      carry = res._d[i] < 0 ? 1 : 0;
      if (carry) {
        res._d[i] += res._base;
      }
    }
    return res.trimLeadingZeros();
  }

  // TODO: add mulInt function for performance optimization
  // O(N^2) -- this is the "school book" algorithm, which mimics the way we learn to do multiplication by hand as children
  // Although it is O(N^2), it is faster in practice than asymptotically better algorithms for multiplicands of <= 256 bits
  @operator("*")
  mul(other: BigInt): BigInt {
    const res: i32[] = new Array<i32>(this._d.length + other._d.length);
    for (let i = 0; i < this._d.length; i++) {
      let carry: i32 = 0;
      for (let j = 0; j < other._d.length || carry; j++) {
        if (j >= other._d.length) {
          res.push(0);
        }
        const otherVal = j < other._d.length ? other._d[j] : 0;
        const cur: u64 = res[i + j] + <u64>this._d[i] * otherVal + carry;
        res[i + j] = <i32>(cur % this._base);
        carry = <i32>(cur / this._base);
      }
    }
    return BigInt.fromDigits(res, this.isNegative != other.isNegative);
  }

  // TEMPORARY
  @operator("/")
  div(other: BigInt): BigInt {
    const denominator: i32 = I32.parseInt(other.toString());
    return this.divInt(denominator);
  }

  // O(N)
  divInt(other: i32): BigInt {
    if (other == 0) throw new RangeError("Divide by zero");
    const res = BigInt.fromDigits(this._d, this.isNegative != other < 0);
    let carry: u64 = 0;
    for (let i = res._d.length - 1; i >= 0; i--) {
      const cur: u64 = res._d[i] + carry * res._base;
      res._d[i] = <i32>(cur / other);
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
      res._d[i] = <i32>(cur / other);
      carry = cur % other;
    }
    return carry;
  }

  // Babylonian method (used in Uniswap contracts)
  // eslint-disable-next-line @typescript-eslint/member-ordering
  static sqrt(y: BigInt): BigInt {
    const one = BigInt.fromDigits([1]);
    const three = BigInt.fromDigits([3]);
    let z: BigInt = BigInt.ZERO;
    if (y.gt(three)) {
      z = y;
      let x: BigInt = y.divInt(2).add(one);
      while (x.lt(z)) {
        z = x;
        x = y.divInt(I32.parseInt(x.toString())).add(x).divInt(2);
      }
    } else if (!y.eq(BigInt.ZERO)) {
      z = one;
    }
    return z;
  }

  @operator("==")
  eq(other: BigInt): boolean {
    return this.compareTo(other) == 0;
  }

  @operator("!=")
  ne(other: BigInt): boolean {
    return !this.eq(other);
  }

  @operator("<")
  lt(other: BigInt): boolean {
    return this.compareTo(other) < 0;
  }

  @operator("<=")
  lte(other: BigInt): boolean {
    return this.compareTo(other) <= 0;
  }

  @operator(">")
  gt(other: BigInt): boolean {
    return this.compareTo(other) > 0;
  }

  @operator(">=")
  gte(other: BigInt): boolean {
    return this.compareTo(other) >= 0;
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
