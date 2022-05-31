use std::ops::Mul;

use web3api_wasm_rs::BigNumber;
pub mod w3;
pub use w3::*;

pub fn method(input: InputMethod) -> BigNumber {
    let mut result = input.arg1.mul(input.obj.prop1);

    if input.arg2.is_some() {
        result = result.mul(input.arg2.unwrap());
    }
    if input.obj.prop2.is_some() {
        result = result.mul(input.obj.prop2.unwrap());
    }

    result
}
