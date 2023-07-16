use polywrap_wasm_rs::wrap_get_implementations;

pub struct TestImport {}

impl TestImport {
  const uri: &'static str = "testimport.uri.eth";

  pub fn get_implementations() -> Vec<String> {
    wrap_get_implementations(Self::uri)
  }
}
