pub mod wrap;
pub use wrap::*;

pub fn method1(input: InputMethod1) -> Vec<Output> {
    vec![
        Output {
            prop: input.arg1.prop,
            nested: Nested {
                prop: input.arg1.nested.prop,
            },
        },
        Output {
            prop: match input.arg2 {
                Some(ref v) => v.prop.clone(),
                None => "".to_string(),
            },
            nested: Nested {
                prop: match input.arg2 {
                    Some(ref v) => v.circular.prop.clone(),
                    None => "".to_string(),
                }
            },
        },
    ]
}

pub fn method2(input: InputMethod2) -> Option<Output> {
    if input.arg.prop == "null".to_string() {
        return None;
    }
    Some(Output {
        prop: input.arg.prop,
        nested: Nested {
            prop: input.arg.nested.prop,
        },
    })
}

pub fn method3(input: InputMethod3) -> Vec<Option<Output>> {
    vec![
        None,
        Some(Output {
            prop: input.arg.prop,
            nested: Nested {
                prop: input.arg.nested.prop,
            },
        }),
    ]
}

pub fn method5(input: InputMethod5) -> Output {
    Output {
        prop: match String::from_utf8(input.arg.prop) {
            Ok(v) => v,
            Err(e) => panic!("{}", e),
        },
        nested: Nested {
            prop: "nested prop".to_string(),
        },
    }
}
