pub mod wrap;
pub use wrap::*;

pub fn log_message(args: ArgsLogMessage) -> bool {
    let message = args.message.as_str();

    println!("{}", message);
    print!("{}", message);

    true
}
