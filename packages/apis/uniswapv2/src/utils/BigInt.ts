// based on https://cp-algorithms.com/algebra/big-integer.html

export class BigInt {
  public readonly isNegative: boolean;
  private readonly d: i32[] = []; // digits stored from least to most significant
  private readonly base: i32 = 1000 * 1000 * 1000; // 10^e
  private readonly e: i32 = 9;

  constructor(bigNumber: string) {
    // TODO: check that input represents an integer. parseInt returns 0 on invalid input; no regex in AS; maybe use ascii?
    // check sign
    if (bigNumber.length >= 1 && bigNumber.charAt(0) == "-") {
      this.isNegative = true;
      bigNumber = bigNumber.substring(1);
    }
    // parse string in baseE-digit segments
    for (let i = bigNumber.length; i > 0; i -= this.e) {
      let digitStr: string;
      if (i < this.e) {
        digitStr = bigNumber.substring(0, i);
      } else {
        digitStr = bigNumber.substring(i - this.e, i);
      }
      this.d.push(I32.parseInt(digitStr));
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
      res.d.push(bigNumber[i]);
    }
    return res.trimLeadingZeros();
  }

  // O(N)
  copy(): BigInt {
    return BigInt.fromDigits(this.d, this.isNegative);
  }

  // O(N)
  opposite(): BigInt {
    return BigInt.fromDigits(this.d, !this.isNegative);
  }

  // O(N)
  add(other: BigInt): BigInt {
    if (this.isNegative && !other.isNegative) {
      return other.sub(this.opposite());
    } else if (!this.isNegative && other.isNegative) {
      return this.sub(other.opposite());
    }
    const res: BigInt = this.copy();
    let carry: bool = 0;
    const n = Math.max(res.d.length, other.d.length);
    for (let i = 0; i < n || carry; i++) {
      if (i == res.d.length) {
        res.d.push(0);
      }
      res.d[i] += carry + (i < other.d.length ? other.d[i] : 0);
      carry = res.d[i] >= res.base ? 1 : 0;
      if (carry) {
        res.d[i] -= res.base;
      }
    }
    return res;
  }

  // O(N)
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
    for (let i = 0; i < other.d.length || carry; i++) {
      res.d[i] -= carry + (i < other.d.length ? other.d[i] : 0);
      carry = res.d[i] < 0 ? 1 : 0;
      if (carry) {
        res.d[i] += res.base;
      }
    }
    return res.trimLeadingZeros();
  }

  // O(N^2) -- this is the "school book" algorithm, which mimics the way we learn to do multiplication by hand as children
  // Although it is O(N^2), it is faster in practice than asymptotically better algorithms for multiplicands of <= 256 bits
  mul(other: BigInt): BigInt {
    const res: i32[] = new Array<i32>(this.d.length + other.d.length);
    for (let i = 0; i < this.d.length; i++) {
      let carry: i32 = 0;
      for (let j = 0; j < other.d.length || carry; j++) {
        if (j >= other.d.length) {
          res.push(0);
        }
        const otherVal = j < other.d.length ? other.d[j] : 0;
        const cur: u64 = res[i + j] + <u64>this.d[i] * otherVal + carry;
        res[i + j] = <i32>(cur % this.base);
        carry = <i32>(cur / this.base);
      }
    }
    return BigInt.fromDigits(res, this.isNegative != other.isNegative);
  }

  // O(N)
  divInt(other: i32): BigInt {
    if (other == 0) throw new RangeError("Divide by zero");
    const res = BigInt.fromDigits(this.d, this.isNegative != other < 0);
    let carry: u64 = 0;
    for (let i = res.d.length - 1; i >= 0; i--) {
      const cur: u64 = res.d[i] + carry * res.base;
      res.d[i] = <i32>(cur / other);
      carry = cur % other;
    }
    return res.trimLeadingZeros();
  }

  // O(N)
  modInt(other: i32): u64 {
    if (other == 0) throw new RangeError("Divide by zero");
    const res = BigInt.fromDigits(this.d, this.isNegative != other < 0);
    let carry: u64 = 0;
    for (let i = res.d.length - 1; i >= 0; i--) {
      const cur: u64 = res.d[i] + carry * res.base;
      res.d[i] = <i32>(cur / other);
      carry = cur % other;
    }
    return carry;
  }

  eq(other: BigInt): boolean {
    return this.compareTo(other) == 0;
  }

  lt(other: BigInt): boolean {
    return this.compareTo(other) < 0;
  }

  lte(other: BigInt): boolean {
    return this.compareTo(other) <= 0;
  }

  gt(other: BigInt): boolean {
    return this.compareTo(other) > 0;
  }

  gte(other: BigInt): boolean {
    return this.compareTo(other) >= 0;
  }

  compareTo(other: BigInt): i8 {
    // opposite signs
    if (this.isNegative && !other.isNegative) return -1;
    if (!this.isNegative && other.isNegative) return 1;
    // different number of "digits"
    if (this.d.length != other.d.length) {
      if (this.d.length > other.d.length && !this.isNegative) return 1;
      else if (other.d.length > this.d.length && !this.isNegative) return -1;
      else if (this.d.length > other.d.length && this.isNegative) return -1;
      else return 1;
    }
    // numbers are same length, so check each "digit"
    for (let i = this.d.length - 1; i >= 0; i--) {
      if (this.d[i] < other.d[i]) return -1;
      if (this.d[i] > other.d[i]) return 1;
    }
    return 0;
  }

  // O(N)
  toString(): string {
    if (this.d.length == 0) return "0";
    let res = this.isNegative ? "-" : "";
    res += this.d[this.d.length - 1].toString();
    for (let i = this.d.length - 2; i >= 0; i--) {
      res += this.d[i].toString().padStart(this.e, "0");
    }
    return res;
  }

  private trimLeadingZeros(): BigInt {
    while (this.d.length > 1 && this.d[this.d.length - 1] == 0) {
      this.d.pop();
    }
    return this;
  }
}
