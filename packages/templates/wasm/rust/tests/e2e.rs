mod types;
use crate::types::wrap::types::{
    TemplateModule,
    TemplateModuleArgsSampleMethod
};

#[test]
fn sample_method() {
    let args = TemplateModuleArgsSampleMethod {
        arg: "input data".to_string(),
    };
    let template: TemplateModule = TemplateModule::new(None, None, None);
    let response = template.sample_method(&args, None, None, None).unwrap();
    assert_eq!(response.result, "input data from sample_method");
}
