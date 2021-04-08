// can replace u64 with u256 and u32 with u128 when they are available

// babylonian method -> https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/libraries/Math.sol
export function sqrt(y: u64): u64 {
  let z: u64 = 0;
  if (y > 3) {
    z = y;
    let x: u64 = y / 2 + 1;
    while (x < z) {
      z = x;
      x = (y / x + x) / 2;
    }
  } else if (y != 0) {
    z = 1;
  }
  return z;
}

// https://medium.com/coinmonks/math-in-solidity-part-3-percents-and-proportions-4db014e080b1
// slightly differs from uniswap implementation -> https://github.com/Uniswap/uniswap-lib/blob/master/contracts/libraries/FullMath.sol
function fullMul(x: u64, y: u64): u64[] {
  // the casts to u32 are intended to wrap around; solidity wraps around on overflow rather than throws
  const xl: u64 = <u32>x;
  const xh: u64 = x >> 128;
  const yl: u64 = <u32>y;
  const yh: u64 = y >> 128;
  const xlyl: u64 = xl * yl;
  const xlyh: u64 = xl * yh;
  const xhyl: u64 = xh * yl;
  const xhyh: u64 = xh * yh;

  const ll: u64 = <u32>xlyl;
  const lh: u64 = (xlyl >> 128) + <u32>xlyh + <u32>xhyl;
  const hl: u64 = <u32>xhyh + (xlyh >> 128) + (xhyl >> 128);
  const hh: u64 = (xhyh >> 128);
  const l = ll + (lh << 128);
  const h = (lh >> 128) + hl + (hh << 128);
  return [l, h];
}

// https://github.com/Uniswap/uniswap-lib/blob/master/contracts/libraries/FullMath.sol
function fullDiv(l: u64, h: u64, d: u64): u64 {
  const pow2: u64 = d & -d;
  d /= pow2;
  l /= pow2;
  l += h * ((-pow2) / pow2 + 1);
  let r: u64 = 1;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  r *= 2 - d * r;
  return l * r;
}

// https://medium.com/coinmonks/math-in-solidity-part-3-percents-and-proportions-4db014e080b1
// slightly differs from uniswap implementation -> https://github.com/Uniswap/uniswap-lib/blob/master/contracts/libraries/FullMath.sol
export function mulDiv(x: u64, y: u64, d: u64): u64 {
  const mulRes: u64[] = fullMul(x, y);
  const l = mulRes[0];
  const h = mulRes[1];
  return fullDiv(l, h, d);
}
