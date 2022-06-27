pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::Map;

pub fn get_key(args: ArgsGetKey) -> i32 {
    *args.map.get(&args.key).unwrap()
}

pub fn return_map(args: ArgsReturnMap) -> Map<String, i32> {
    args.map
}
