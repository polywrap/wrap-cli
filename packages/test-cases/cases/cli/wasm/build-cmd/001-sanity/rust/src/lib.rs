pub mod wrap;
pub use wrap::*;

pub fn method(args: wrap::module::ArgsMethod) -> String {
  args.arg
}