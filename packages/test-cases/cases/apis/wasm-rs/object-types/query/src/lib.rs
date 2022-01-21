pub mod w3;
pub use w3::*;

pub fn method1(input: InputMethod1) -> Vec<Output> {
    vec![
        Output {
            prop: input.arg1.prop,
            nested: Nested {
                prop: input.arg1.nested.prop,
            },
        },
        Output {
            prop: input.arg2.clone().unwrap().prop,
            nested: Nested {
                prop: input.arg2.unwrap().circular.prop,
            },
        },
    ]
}

pub fn method2(input: InputMethod2) -> Option<Output> {
    if input.arg.prop.is_empty() {
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
        prop: String::from_utf8(input.arg.prop).unwrap(),
        nested: Nested {
            prop: "nested prop".to_string(),
        },
    }
}
