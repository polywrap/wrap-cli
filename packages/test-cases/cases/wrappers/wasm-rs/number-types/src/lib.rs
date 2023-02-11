pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn i8_method(&self, args: ArgsI8Method) -> Result<i8, String> {
        Ok(args.first + args.second)
    }
    
    fn u8_method(&self, args: ArgsU8Method) -> Result<u8, String> {
        Ok(args.first + args.second)
    }
    
    fn i16_method(&self, args: ArgsI16Method) -> Result<i16, String> {
        Ok(args.first + args.second)
    }
    
    fn u16_method(&self, args: ArgsU16Method) -> Result<u16, String> {
        Ok(args.first + args.second)
    }
    
    fn i32_method(&self, args: ArgsI32Method) -> Result<i32, String> {
        Ok(args.first + args.second)
    }
    
    fn u32_method(&self, args: ArgsU32Method) -> Result<u32, String> {
        Ok(args.first + args.second)
    }    
}
