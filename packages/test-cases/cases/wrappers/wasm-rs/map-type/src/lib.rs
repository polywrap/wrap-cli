pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::Map;

pub fn get_key(args: ArgsGetKey) -> i32 {
    *args.foo.map.get(&args.key).unwrap()
}

pub fn return_map(args: ArgsReturnMap) -> Map<String, i32> {
    args.map
}

pub fn return_custom_map(args: ArgsReturnCustomMap) -> CustomMap {
    args.foo
}

pub fn return_nested_map(args: ArgsReturnNestedMap) -> Map<String, Map<String, i32>> {
    args.foo
}

pub fn return_map_of_enum(args: ArgsReturnMapOfEnum) -> Map<String, MyEnum> {
    args.map
}
