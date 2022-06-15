pub mod polywrap;
pub use polywrap::*;
use web3api_wasm_rs::Map;

pub fn get_key(input: InputGetKey) -> i32 {
    *input.map.get(&input.key).unwrap()
}

pub fn return_map(input: InputReturnMap) -> Map<String, i32> {
    input.map
}
