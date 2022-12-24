pub mod wrap;
pub use wrap::*;
use wrap::module::{IModule, Module};

impl IModule for Module {
    fn bool_method(&self, args: ArgsBoolMethod) -> Result<bool, String> {
        Ok(args.arg)
    }
    
    fn int_method(&self, args: ArgsIntMethod) -> Result<i32, String> {
        Ok(args.arg)
    }
    
    fn u_int_method(&self, args: ArgsUIntMethod) -> Result<u32, String> {
        Ok(args.arg)
    }
    
    fn bytes_method(&self, args: ArgsBytesMethod) -> Result<Vec<u8>, String> {
        Ok(args.arg)
    }
    
    fn array_method(&self, args: ArgsArrayMethod) -> Result<Option<Vec<String>>, String> {
        Ok(Some(args.arg))
    }
}
