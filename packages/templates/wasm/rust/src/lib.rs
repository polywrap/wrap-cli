pub mod wrap;
pub use wrap::*;

impl ModuleTrait for Module {
    fn sample_method(&self, args: ArgsSampleMethod) -> Result<SampleResult, String> {
        return Ok(SampleResult {
            result: args.arg
        });
    }
}
