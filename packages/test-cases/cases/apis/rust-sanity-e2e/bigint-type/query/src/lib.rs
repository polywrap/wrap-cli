extern crate alloc;

use std::ops::Mul;

use polywrap_wasm_rs::BigInt;
pub mod w3;
pub use w3::*;

pub fn big_int_method(input: InputBigIntMethod) -> BigInt {
    let mut result = input.arg1.mul(input.obj.prop1);

    if input.arg2.is_some() {
        result = result.mul(input.arg2.unwrap());
    }
    if input.obj.prop2.is_some() {
        result = result.mul(input.obj.prop2.unwrap());
    }

    result
}
