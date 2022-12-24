pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::Map;
use wrap::module::{IModule, Module};

impl IModule for Module {
    fn get_key(&self, args: ArgsGetKey) -> Result<i32, String> {
        Ok(*args.foo.map.get(&args.key).unwrap())
    }
    
    fn return_map(&self, args: ArgsReturnMap) -> Result<Map<String, i32>, String> {
        Ok(args.map)
    }
    
    fn return_custom_map(&self, args: ArgsReturnCustomMap) -> Result<CustomMap, String> {
        Ok(args.foo)
    }
    
    fn return_nested_map(&self, args: ArgsReturnNestedMap) -> Result<Map<String, Map<String, i32>>, String> {
        Ok(args.foo)
    }
    
    fn return_map_of_enum(&self, args: ArgsReturnMapOfEnum) -> Result<Map<String, MyEnum>, String> {
        Ok(args.map)
    }
}
