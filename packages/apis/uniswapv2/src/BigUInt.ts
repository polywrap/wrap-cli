// based on https://cp-algorithms.com/algebra/big-integer.html
class BigUInt {
  private readonly d: i32[] = []; // digits stored from least to most significant
  private readonly base: i32 = 1000 * 1000 * 1000; // 10^9

  constructor(bigNumber: string) {
    // TODO: check that input represents a positive integer (parseInt returns 0 on invalid input; no regex in AS)
    // parse string into 9-digit segments
    for (let i = bigNumber.length; i > 0; i -= 9) {
      let digitStr;
      if (i < 9) {
        digitStr = bigNumber.substring(0, i);
      } else {
        digitStr = bigNumber.substring(i - 9, i);
      }
      this.d.push(I32.parseInt(digitStr));
    }
    // remove any leading zeros
    this.trimLeadingZeros();
  }

  static fromString(bigNumber: string): BigUInt {
    return new BigUInt(bigNumber);
  }

  static fromDigits(bigNumber: i32[]): BigUInt {
    const res = new BigUInt("");
    for (let i = 0; i < bigNumber.length; i++) {
      res.d.push(bigNumber[i]);
    }
    return res.trimLeadingZeros();
  }

  // O(N)
  add(other: BigUInt): BigUInt {
    const res: BigUInt = this.copy();
    let carry = 0;
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
  sub(other: BigUInt): BigUInt {
    // TODO: enforce that a > b in subtraction a - b
    const res: BigUInt = this.copy();
    let carry = 0;
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
  // TODO: there are more efficient multiplication algorithms that can get us to O(NlogN) worst case performance
  mul(other: BigUInt): BigUInt {
    const res: i32[] = new Array<i32>(this.d.length + other.d.length);
    for (let i = 0; i < this.d.length; i++) {
      let carry: i32 = 0;
      for (let j = 0; j < other.d.length || carry; j++) {
        const otherVal = j < other.d.length ? other.d[j] : 0;
        const cur: i64 = res[i + j] + this.d[i] * otherVal + carry;
        res[i + j] = <i32>(cur % this.base);
        carry = <i32>(cur / this.base);
      }
    }
    return BigUInt.fromDigits(res);
  }

  // O(N)
  divInt(other: i32) {
    const res: BigUInt = this.copy();
    let carry: i32 = 0;
    for (let i = res.d.length - 1; i >= 0; i--) {
      const cur: i64 = res.d[i] + carry * res.base;
      res.d[i] = <i32>(cur / other);
      carry = <i32>(cur % other);
    }
    return res.trimLeadingZeros();
  }

  // O(N)
  modInt(other: i32) {
    const res: BigUInt = this.copy();
    let carry: i32 = 0;
    for (let i = res.d.length - 1; i >= 0; i--) {
      const cur: i64 = res.d[i] + carry * res.base;
      res.d[i] = <i32>(cur / other);
      carry = <i32>(cur % other);
    }
    return carry;
  }

  // O(N)
  toString() {
    let res = (this.d.length == 0 ? 0 : this.d[this.d.length - 1]).toString();
    for (let i = this.d.length - 2; i >= 0; i--) {
      res += this.d[i].toString().padStart(9, "0");
    }
    return res;
  }

  // O(N)
  copy(): BigUInt {
    return BigUInt.fromDigits(this.d);
  }

  private trimLeadingZeros(): BigUInt {
    while (this.d.length > 1 && this.d[this.d.length - 1] == 0) {
      this.d.pop();
    }
    return this;
  }
}
