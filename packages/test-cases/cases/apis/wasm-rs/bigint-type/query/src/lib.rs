use std::ops::Mul;

use polywrap_wasm_rs::BigInt;
pub mod w3;
pub use w3::*;

pub fn method(input: InputMethod) -> BigInt {
    let mut result = input.arg1.mul(input.obj.prop1);
    match input.arg2 {
        Some(v) => {
            result = result.mul(v);
        }
        None => {
            panic!("No `arg2`");
        }
    }
    match input.obj.prop2 {
        Some(v) => {
            result = result.mul(v);
        }
        None => {
            panic!("No `prop2`");
        }
    }
    result
}
