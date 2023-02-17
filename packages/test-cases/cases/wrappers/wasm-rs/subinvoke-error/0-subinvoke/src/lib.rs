pub mod wrap;
pub use wrap::{*, imported::bad_util_module::ArgsIThrow };

pub fn sub_invoke_will_throw(args: ArgsSubInvokeWillThrow) -> i32 {
    let sub_invoke_result = BadUtilModule::i_throw( &ArgsIThrow { a: 0 }).unwrap();
    args.a + args.b + sub_invoke_result
}