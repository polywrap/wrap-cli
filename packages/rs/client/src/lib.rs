use wasm_instance::State;

pub mod wasm_instance;

type InvokeResult = Result<Vec<u8>, Box<dyn std::error::Error>>;
struct InvocableResult {
  result: InvokeResult,
  encoded: Option<bool>
}

struct WasmWrapper {
  state: State,
}

impl WasmWrapper {
  pub fn new() -> Self {
    Self { state: State::default() }
  }

  pub async fn invoke(&self) -> Result<(), Box<dyn std::error::Error>> {
    Ok(())
  }
}
pub async fn main() {
}

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
      crate::main();
  }
}