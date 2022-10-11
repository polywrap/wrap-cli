use std::sync::Arc;
use std::sync::Mutex;

use serde::de::DeserializeOwned;
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
    pub async fn invoke<T>(wasm_module: &WasmModule, method: &str, args: Vec<u8>) -> ()
    where
        T: DeserializeOwned + std::fmt::Debug,
    {
        let mut initial_state = State::default();
        initial_state.method = method.to_string().as_bytes().to_vec();
        initial_state.args = args.to_vec();

        let params = &[
            Val::I32(initial_state.method.len().try_into().unwrap()),
            Val::I32(initial_state.args.len().try_into().unwrap()),
            Val::I32(1),
        ];

        let state = Arc::new(Mutex::new(initial_state));
        let abort = Arc::new(|msg| panic!("WasmWrapper: Wasm module aborted execution: {}", msg));
        let mut wasm_instance = WasmInstance::new(wasm_module, Arc::clone(&state), abort.clone())
            .await
            .unwrap();

        let mut result: [Val; 1] = [Val::I32(0)];
        wasm_instance
            .call_export("_wrap_invoke", params, &mut result)
            .await;

        let state_guard = state.lock().unwrap();

        if result[0].unwrap_i32() == 1 {
            if state_guard.invoke.result.is_none() {
                abort("Invoke result is missing".to_string());
            }

            println!(
                "Result: {:?}",
                rmp_serde::decode::from_slice::<T>(
                    &state_guard.invoke.result.as_ref().unwrap().as_slice()
                )
            );
        } else {
            if state_guard.invoke.error.is_none() {
                abort("Invoke error is missing".to_string());
            }

            println!("Error: {:?}", state_guard.invoke.error);
        }
    }

    pub async fn invoke_no_decode(wasm_module: &WasmModule, method: &str, args: Vec<u8>) -> () {
        let mut initial_state = State::default();
        initial_state.method = method.to_string().as_bytes().to_vec();
        initial_state.args = args.to_vec();

        let params = &[
            Val::I32(initial_state.method.len().try_into().unwrap()),
            Val::I32(initial_state.args.len().try_into().unwrap()),
            Val::I32(1),
        ];

        let state = Arc::new(Mutex::new(initial_state));
        let abort = Arc::new(|msg| panic!("WasmWrapper: Wasm module aborted execution: {}", msg));
        let mut wasm_instance = WasmInstance::new(wasm_module, Arc::clone(&state), abort.clone())
            .await
            .unwrap();

        let mut result: [Val; 1] = [Val::I32(0)];
        wasm_instance
            .call_export("_wrap_invoke", params, &mut result)
            .await;

        let state_guard = state.lock().unwrap();

        if result[0].unwrap_i32() == 1 {
            if state_guard.invoke.result.is_none() {
                abort("Invoke result is missing".to_string());
            }

            println!(
                "Result: {:?}",
                &state_guard.invoke.result.as_ref().unwrap().as_slice()
            );
        } else {
            if state_guard.invoke.error.is_none() {
                abort("Invoke error is missing".to_string());
            }

            println!("Error: {:?}", state_guard.invoke.error);
        }
    }
}

#[tokio::test]
pub async fn invoke() {
    let wasm_module = wasm_instance::WasmModule::Path("src/wrap.wat".to_string());
    WasmWrapper::invoke::<String>(
        &wasm_module,
        "method",
        vec![
            130, 164, 97, 114, 103, 49, 179, 49, 50, 51, 52, 46, 53, 54, 55, 56, 57, 49, 50, 51,
            52, 53, 54, 55, 56, 57, 163, 111, 98, 106, 129, 165, 112, 114, 111, 112, 49, 179, 57,
            56, 46, 55, 54, 53, 52, 51, 50, 49, 57, 56, 55, 54, 53, 52, 51, 50, 49,
        ],
    )
    .await;
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_invokes() {
        crate::invoke();
    }
}
