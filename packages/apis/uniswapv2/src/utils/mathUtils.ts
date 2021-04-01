
// babylonian method -> https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/libraries/Math.sol
export function sqrt(y: u256): u256 {
  let z: u256;
  if (y > 3) {
    z = y;
    let x: u256 = y / 2 + 1;
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
function fullMul(x: u256, y: u256): u256[] {
  // TODO: the casts to u128 are intended to wrap around; solidity wraps around on overflow rather than throws
  const xl: u256 = <u128>x;
  const xh: u256 = x >> 128;
  const yl: u256 = <u128>y;
  const yh: u256 = y >> 128;
  const xlyl: u256 = xl * yl;
  const xlyh: u256 = xl * yh;
  const xhyl: u256 = xh * yl;
  const xhyh: u256 = xh * yh;

  const ll: u256 = <u128>xlyl;
  const lh: u256 = (xlyl >> 128) + <u128>xlyh + <u128>xhyl;
  const hl: u256 = <u128>xhyh + (xlyh >> 128) + (xhyl >> 128);
  const hh: u256 = (xhyh >> 128);
  const l = ll + (lh << 128);
  const h = (lh >> 128) + hl + (hh << 128);
  return [l, h];
}

// https://github.com/Uniswap/uniswap-lib/blob/master/contracts/libraries/FullMath.sol
function fullDiv(l: u256, h: u256, d: u256): u256 {
  const pow2: u256 = d & -d;
  d /= pow2;
  l /= pow2;
  l += h * ((-pow2) / pow2 + 1);
  let r: u256 = 1;
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
export function mulDiv(x: u256, y: u256, d: u256): u256 {
  let [l, h] = fullMul(x, y);
  return fullDiv(l, h, d);
}