pub mod wrap;
pub use wrap::*;

pub fn _if(args: ArgsIf) -> Else {
    Else {
        _else: args._if._else
    }
}

pub fn _for(args: ArgsFor) -> _Box {
    let value: While = args._in;
    _Box {
        _box: get_while_key(value).unwrap()
    }
}

