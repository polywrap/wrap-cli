pub mod wrap;
pub use wrap::*;

pub fn sample_method(args: ArgsSampleMethod) -> SampleResult {
    return SampleResult {
        value: args.arg
    };
}

