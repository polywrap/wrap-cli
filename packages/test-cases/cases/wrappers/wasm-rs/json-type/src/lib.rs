pub mod wrap;
pub use wrap::*;
use polywrap_wasm_rs::JSON;
use serde_json::json;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn stringify(&self, args: ArgsStringify) -> Result<String, String> {
        let mut new_string = String::from("");
        for object in &args.values {
            new_string.push_str(&object.to_string());
        }
        Ok(new_string)
    }
    
    fn parse(&self, args: ArgsParse) -> Result<JSON::Value, String> { 
        Ok(JSON::from_str(&args.value).unwrap())
    }
    
    fn stringify_object(&self, args: ArgsStringifyObject) -> Result<String, String> {
        let mut new_string = String::from(&args.object.json_a.to_string());
        new_string.push_str(&args.object.json_b.to_string());
        Ok(new_string)
    }
    
    fn method_j_s_o_n(&self, args: ArgsMethodJSON) -> Result<JSON::Value, String> {
        Ok(json!({
            "valueA": args.value_a,
            "valueB": args.value_b,
            "valueC": args.value_c
        }))
    }
    
    fn stringify_reserved(&self, args: ArgsStringifyReserved) -> Result<String, String> {
        Ok(JSON::to_string(&args.reserved).unwrap())
    }
    
    fn parse_reserved(&self, args: ArgsParseReserved) -> Result<Reserved, String> {
        Ok(JSON::from_str::<Reserved>(&args.json).unwrap())
    }
    
}
