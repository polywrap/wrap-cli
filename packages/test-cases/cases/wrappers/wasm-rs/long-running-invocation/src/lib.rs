pub mod wrap;
pub use wrap::*;
use crate::imported::sleep_module;

pub fn sleep_loop(args: ArgsSleepLoop) -> bool {
    for i in 1..args.repeats {
        SleepModule::sleep(&sleep_module::ArgsSleep { ms: args.ms_per_sleep });
    }
    return true;
}
