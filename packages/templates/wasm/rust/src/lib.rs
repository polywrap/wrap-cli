pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
    fn sample_method(&self, args: ArgsSampleMethod) -> SampleResult {
        return SampleResult {
            result: args.arg
        };
    }
}
