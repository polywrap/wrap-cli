use crate::types::wrap::types::{
    Template,
    TemplateArgsSampleMethod
};

#[test]
fn sample_method() {
    let args = TemplateArgsSampleMethod {
        arg: "input data".to_string(),
    };
    let template: Template = Template::new(None);
    let response = template.sample_method(&args, None).unwrap();
    assert_eq!(response.result, "input data from sample_method");
}
