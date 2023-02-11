pub mod wrap;
pub use wrap::*;
use wrap::module::{ModuleTrait, Module};

impl ModuleTrait for Module {
    fn method1(&self, args: ArgsMethod1) -> Result<Vec<Output>, String> {
        Ok(vec![
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
        ])
    }
    
    fn method2(&self, args: ArgsMethod2) -> Result<Option<Output>, String> {
        if args.arg.prop == "null".to_string() {
            return Ok(None);
        }
        Ok(Some(Output {
            prop: args.arg.prop,
            nested: Nested {
                prop: args.arg.nested.prop,
            },
        }))
    }
    
    fn method3(&self, args: ArgsMethod3) -> Result<Vec<Option<Output>>, String> {
        Ok(vec![
            None,
            Some(Output {
                prop: args.arg.prop,
                nested: Nested {
                    prop: args.arg.nested.prop,
                },
            }),
        ])
    }
    
    fn method5(&self, args: ArgsMethod5) -> Result<Output, String> {
        Ok(Output {
            prop: match String::from_utf8(args.arg.prop) {
                Ok(v) => v,
                Err(e) => panic!("{}", e),
            },
            nested: Nested {
                prop: "nested prop".to_string(),
            },
        })
    }    
}
