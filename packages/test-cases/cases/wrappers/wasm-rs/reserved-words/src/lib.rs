pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn _if(&self, args: ArgsIf) -> Result<Else, String> {
        Ok(Else {
            _else: args._if._else
        })
    }
    
    fn _for(&self, args: ArgsFor) -> Result<_Box, String> {
        let value: While = args._in;
        Ok(_Box {
            _box: get_while_key(value).unwrap()
        })
    }    
}
