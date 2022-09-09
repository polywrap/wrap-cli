pub mod wrap;
pub use wrap::*;
pub use wrap::imported::interface_module;
pub use wrap::imported::interface_argument;

pub fn module_implementations(args: ArgsModuleImplementations) -> Vec<String> {
    Interface::get_implementations()
}

pub fn module_method(args: ArgsModuleMethod) -> ImplementationType {
    args.arg
}

pub fn abstract_module_method(args: ArgsAbstractModuleMethod) -> String {
    let impls = Interface::get_implementations();
    let uri: String = impls[0].to_owned();
    let module = InterfaceModule::new(&uri);
    let method_args = interface_module::serialization::ArgsAbstractModuleMethod {
        arg: interface_argument::InterfaceArgument {
            str: args.arg.str
        }
    };
    module.abstract_module_method(&method_args).unwrap()
}
