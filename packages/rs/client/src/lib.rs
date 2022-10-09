use std::sync::Arc;
use std::sync::Mutex;

use wasm_instance::State;

pub mod wasm_instance;
pub mod wrap_import;

use wasm_instance::WasmInstance;
use wasm_instance::WasmModule;
use wasmtime::Val;

type InvokeResult = Result<Vec<u8>, Box<dyn std::error::Error>>;
struct InvocableResult {
    result: InvokeResult,
    encoded: Option<bool>,
}

struct WasmWrapper {
    state: Arc<Mutex<State>>,
}

impl WasmWrapper {
    pub async fn invoke(wasm_module: WasmModule, method: &str, args: Vec<u8>) -> () {
        let mut initial_state = State::default();
        initial_state.method = method.to_string().as_bytes().to_vec();
        initial_state.args = args.to_vec();

        let params = &[
          Val::I32(initial_state.method.len().try_into().unwrap()),
          Val::I32(initial_state.args.len().try_into().unwrap()),
          Val::I32(0),
        ];

        let state = Arc::new(Mutex::new(initial_state));
        let abort = Arc::new(|msg| panic!("WasmWrapper: Wasm module aborted execution: {}", msg));
        let mut wasm_instance = WasmInstance::new(wasm_module, Arc::clone(&state), abort)
            .await
            .unwrap();

        let mut result: [Val; 1] = [Val::I32(0)];
        wasm_instance
            .call_export(
                "_wrap_invoke",
                params,
                &mut result,
            )
            .await;

        print!("result: {:?}", result);
    }
}

#[tokio::main]
pub async fn main() {
    WasmWrapper::invoke(
            wasm_instance::WasmModule::Path("src/wrap.wat".to_string()),
            "method",
            vec![1, 2, 3],
        )
        .await;
    //   "method",
    // args: {
    //   arg1: "1234.56789123456789",
    //   obj: {
    //     prop1: "98.7654321987654321",
    //   },
    // }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        crate::main();
    }
}
