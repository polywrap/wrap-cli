pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn module_method(&self, args: ArgsModuleMethod) -> Result<ImplementationType, String> {
        Ok(args.arg)
    }
    
    fn abstract_module_method(&self, args: ArgsAbstractModuleMethod) -> Result<String, String> {
        Ok(args.arg.str)
    }
}
