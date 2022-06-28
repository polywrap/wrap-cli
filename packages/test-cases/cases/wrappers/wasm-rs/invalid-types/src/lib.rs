pub mod wrap;
pub use wrap::*;

pub fn bool_method(args: ArgsBoolMethod) -> bool {
    args.arg
}

pub fn int_method(args: ArgsIntMethod) -> i32 {
    args.arg
}

pub fn u_int_method(args: ArgsUIntMethod) -> u32 {
    args.arg
}

pub fn bytes_method(args: ArgsBytesMethod) -> Vec<u8> {
    args.arg
}

pub fn array_method(args: ArgsArrayMethod) -> Option<Vec<String>> {
    Some(args.arg)
}
