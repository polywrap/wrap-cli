use polywrap_wasm_rs::Context;

#[test]
fn push_and_pop_values() {
    let mut context = Context::new();
    assert_eq!(context.get_length(), 0);
    assert!(context.is_empty());
    context.push("property", "string", "");
    context.push("property", "i32", "");
    context.push("property", "bool", "");
    assert_eq!(context.get_length(), 3);
    assert!(!context.is_empty());
    context.pop();
    context.pop();
    context.pop();
    assert_eq!(context.get_length(), 0);
    assert!(context.is_empty());
}

#[test]
fn print_in_desired_format() {
    let mut context = Context::new();
    context.description = "Deserializing MyObject".to_string();
    context.push("propertyOne", "unknown", "searching for property type");

    assert_eq!(context.context_to_string(), "  Context: Deserializing MyObject\n   at propertyOne : unknown >> searching for property type".to_string());

    assert_eq!(context.print_with_context("Invalid length"), "Invalid length\n Context: Deserializing MyObject\n at propertyOne : unknown >> searching for property type");

    context.push("propertyOne", "i32", "type found, reading property");
    assert_eq!(context.print_with_context("\nInvalid length"), "\nInvalid length\n Context: Deserializing MyObject\n at propertyOne : i32 >> type found, reading property\n at propertyOne : unknown >> searching for property type");
}
