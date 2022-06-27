pub mod wrap;
pub use wrap::*;

pub fn method1(args: ArgsMethod1) -> Vec<Output> {
    vec![
        Output {
            prop: args.arg1.prop,
            nested: Nested {
                prop: args.arg1.nested.prop,
            },
        },
        Output {
            prop: match args.arg2 {
                Some(ref v) => v.prop.clone(),
                None => "".to_string(),
            },
            nested: Nested {
                prop: match args.arg2 {
                    Some(ref v) => v.circular.prop.clone(),
                    None => "".to_string(),
                }
            },
        },
    ]
}

pub fn method2(args: ArgsMethod2) -> Option<Output> {
    if args.arg.prop == "null".to_string() {
        return None;
    }
    Some(Output {
        prop: args.arg.prop,
        nested: Nested {
            prop: args.arg.nested.prop,
        },
    })
}

pub fn method3(args: ArgsMethod3) -> Vec<Option<Output>> {
    vec![
        None,
        Some(Output {
            prop: args.arg.prop,
            nested: Nested {
                prop: args.arg.nested.prop,
            },
        }),
    ]
}

pub fn method5(args: ArgsMethod5) -> Output {
    Output {
        prop: match String::from_utf8(args.arg.prop) {
            Ok(v) => v,
            Err(e) => panic!("{}", e),
        },
        nested: Nested {
            prop: "nested prop".to_string(),
        },
    }
}
