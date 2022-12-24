use std::ops::Mul;

use polywrap_wasm_rs::BigInt;
pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module};

impl IModule for Module {
    fn method(&self, args: ArgsMethod) -> Result<BigInt, String> {
        let mut result = args.arg1.mul(args.obj.prop1);
    
        if args.arg2.is_some() {
            result = result.mul(args.arg2.unwrap());
        }
        if args.obj.prop2.is_some() {
            result = result.mul(args.obj.prop2.unwrap());
        }
    
        Ok(result)
    }
}
