pub mod wrap;
pub use wrap::imported::interface_argument;
pub use wrap::imported::interface_module;
use wrap::module::{IModule, Module};
pub use wrap::*;

impl IModule for Module {
    fn module_implementations(&self, args: ArgsModuleImplementations) -> Result<Vec<String>, String> {
        Ok(Interface::get_implementations())
    }
    
    fn module_method(&self, args: ArgsModuleMethod) -> Result<ImplementationType, String> {
        Ok(args.arg)
    }
    
    fn abstract_module_method(&self, args: ArgsAbstractModuleMethod) -> Result<String, String> {
        let impls = Interface::get_implementations();
        let module = InterfaceModule::new(impls[0].clone());
        let method_args = interface_module::serialization::ArgsAbstractModuleMethod {
            arg: interface_argument::InterfaceArgument { str: args.arg.str },
        };
        module.abstract_module_method(&method_args)
    }
    
}

