// TODO:
// import { Bytes } from "./Bytes";

// /** An arbitrary size integer represented as an array of bytes. */
// export class BigInt extends Uint8Array {
//   static fromI32(x: i32): BigInt {
//     return (Bytes.fromI32(x) as Uint8Array) as BigInt
//   }

//   /**
//    * `bytes` assumed to be little-endian. If your input is big-endian, call `.reverse()` first.
//    */

//   static fromSignedBytes(bytes: Bytes): BigInt {
//     return (bytes as Uint8Array) as BigInt
//   }

//   /**
//    * `bytes` assumed to be little-endian. If your input is big-endian, call `.reverse()` first.
//    */

//   static fromUnsignedBytes(bytes: Bytes): BigInt {
//     let signedBytes = new BigInt(bytes.length + 1)
//     for (let i = 0; i < bytes.length; i++) {
//       signedBytes[i] = bytes[i]
//     }
//     signedBytes[bytes.length] = 0
//     return signedBytes
//   }

//   toHex(): string {
//     return typeConversion.bigIntToHex(this)
//   }

//   toHexString(): string {
//     return typeConversion.bigIntToHex(this)
//   }

//   toString(): string {
//     return typeConversion.bigIntToString(this)
//   }

//   toI32(): i32 {
//     return ((this as Uint8Array) as Bytes).toI32()
//   }

//   toBigDecimal(): BigDecimal {
//     return new BigDecimal(this)
//   }

//   isZero(): boolean {
//     return this == BigInt.fromI32(0)
//   }

//   isI32(): boolean {
//     return BigInt.fromI32(i32.MIN_VALUE) <= this && this <= BigInt.fromI32(i32.MAX_VALUE)
//   }

//   abs(): BigInt {
//     return this < BigInt.fromI32(0) ? -this : this
//   }

//   // Operators

//   @operator('+')
//   plus(other: BigInt): BigInt {
//     return bigInt.plus(this, other)
//   }

//   @operator('-')
//   minus(other: BigInt): BigInt {
//     return bigInt.minus(this, other)
//   }

//   @operator('*')
//   times(other: BigInt): BigInt {
//     return bigInt.times(this, other)
//   }

//   @operator('/')
//   div(other: BigInt): BigInt {
//     return bigInt.dividedBy(this, other)
//   }

//   divDecimal(other: BigDecimal): BigDecimal {
//     return bigInt.dividedByDecimal(this, other)
//   }

//   @operator('%')
//   mod(other: BigInt): BigInt {
//     return bigInt.mod(this, other)
//   }

//   @operator('==')
//   equals(other: BigInt): boolean {
//     return BigInt.compare(this, other) == 0
//   }

//   @operator('!=')
//   notEqual(other: BigInt): boolean {
//     return !(this == other)
//   }

//   @operator('<')
//   lt(other: BigInt): boolean {
//     return BigInt.compare(this, other) == -1
//   }

//   @operator('>')
//   gt(other: BigInt): boolean {
//     return BigInt.compare(this, other) == 1
//   }

//   @operator('<=')
//   le(other: BigInt): boolean {
//     return !(this > other)
//   }

//   @operator('>=')
//   ge(other: BigInt): boolean {
//     return !(this < other)
//   }

//   @operator.prefix('-')
//   neg(): BigInt {
//     return BigInt.fromI32(0) - this
//   }

//   /// Limited to a low exponent to discourage creating a huge BigInt.
//   pow(exp: u8): BigInt {
//     return bigInt.pow(this, exp)
//   }

//   /**
//    * Returns −1 if a < b, 1 if a > b, and 0 if A == B
//    */
//   static compare(a: BigInt, b: BigInt): i32 {
//     // Check if a and b have the same sign.
//     let aIsNeg = a.length > 0 && a[a.length - 1] >> 7 == 1
//     let bIsNeg = b.length > 0 && b[b.length - 1] >> 7 == 1

//     if (!aIsNeg && bIsNeg) {
//       return 1
//     } else if (aIsNeg && !bIsNeg) {
//       return -1
//     }

//     // Check how many bytes of a and b are relevant to the magnitude.
//     let aRelevantBytes = a.length
//     while (
//       aRelevantBytes > 0 &&
//       ((!aIsNeg && a[aRelevantBytes - 1] == 0) ||
//         (aIsNeg && a[aRelevantBytes - 1] == 255))
//     ) {
//       aRelevantBytes -= 1
//     }
//     let bRelevantBytes = b.length
//     while (
//       bRelevantBytes > 0 &&
//       ((!bIsNeg && b[bRelevantBytes - 1] == 0) ||
//         (bIsNeg && b[bRelevantBytes - 1] == 255))
//     ) {
//       bRelevantBytes -= 1
//     }

//     // If a and b are positive then the one with more relevant bytes is larger.
//     // Otherwise the one with less relevant bytes is larger.
//     if (aRelevantBytes > bRelevantBytes) {
//       return aIsNeg ? -1 : 1
//     } else if (bRelevantBytes > aRelevantBytes) {
//       return aIsNeg ? 1 : -1
//     }

//     // We now know that a and b have the same sign and number of relevant bytes.
//     // If a and b are both negative then the one of lesser magnitude is the
//     // largest, however since in two's complement the magnitude is flipped, we
//     // may use the same logic as if a and b are positive.
//     let relevantBytes = aRelevantBytes
//     for (let i = 1; i <= relevantBytes; i++) {
//       if (a[relevantBytes - i] < b[relevantBytes - i]) {
//         return -1
//       } else if (a[relevantBytes - i] > b[relevantBytes - i]) {
//         return 1
//       }
//     }

//     return 0
//   }
// }
