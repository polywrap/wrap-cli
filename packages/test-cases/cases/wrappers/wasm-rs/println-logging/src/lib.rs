pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn log_message(&self, args: ArgsLogMessage) -> Result<bool, String> {
        let message = args.message.as_str();
    
        println!("{}", message);
        print!("{}", message);
    
        Ok(true)
    }
}
