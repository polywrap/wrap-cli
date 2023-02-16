pub mod wrap;
pub use wrap::*;

pub fn i_throw(args: ArgsIThrow) -> i32 {
  if 2 == 2 {
    panic!("I threw an error!");
  }
  args.a + 1
}
