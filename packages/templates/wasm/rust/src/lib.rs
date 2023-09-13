pub mod wrap;
pub use wrap::prelude::*;

impl ModuleTrait for Module {
    fn sample_method(args: ArgsSampleMethod) -> Result<SampleResult, String> {
        return Ok(SampleResult {
            result: format!("{} from sample_method", args.arg),
        });
    }
}
