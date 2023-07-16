pub mod wrapped;
pub use wrapped::{
    module_method_wrapped,
    ArgsModuleMethod,
    object_method_wrapped,
    ArgsObjectMethod,
    optional_env_method_wrapped,
    ArgsOptionalEnvMethod,
    if_wrapped,
    ArgsIf
};

pub mod module;
pub use module::*;
