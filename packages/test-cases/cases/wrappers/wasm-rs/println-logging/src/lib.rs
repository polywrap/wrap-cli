pub mod wrap;
pub use wrap::*;
pub use wrap::module::{IModule, Module};

impl IModule for Module {
    fn log_message(&self, args: ArgsLogMessage) -> Result<bool, String> {
        let message = args.message.as_str();
    
        println!("{}", message);
        print!("{}", message);
    
        Ok(true)
    }
}
