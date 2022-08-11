pub mod wrap;
pub use wrap::*;
use crate::imported::sleep_module;

pub fn sleep_loop(args: ArgsSleepLoop) -> bool {
    for i in 0..args.repeats {
        match SleepModule::sleep(&sleep_module::ArgsSleep { ms: args.ms_per_sleep }) {
            Ok(val) => val,
            Err(e) => panic!("Error on iteration {}: {}", i, e)
        };
    }
    return true;
}
