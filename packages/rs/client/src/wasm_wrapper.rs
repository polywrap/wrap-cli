use std::sync::Arc;
use std::sync::Mutex;

use crate::error::WrapperError;
use crate::file_reader::FileReader;
use crate::wasm_instance::State;
use serde::de::DeserializeOwned;

use crate::wasm_instance::WasmInstance;
use crate::wasm_instance::WasmModule;
use wasmtime::Val;

pub struct WasmWrapper<FReader: FileReader> {
    wasm_module: Option<WasmModule>,
    file_reader: FReader,
}

pub struct WasmWrapperConfig<FReader: FileReader> {
    pub file_reader: FReader,
}

impl<FReader: FileReader + Sized> WasmWrapper<FReader> {
    pub fn new(config: WasmWrapperConfig<FReader>) -> Self {
        Self {
            wasm_module: None,
            file_reader: config.file_reader,
        }
    }
    pub fn invoke<T>(&mut self, method: &str, args: &Vec<u8>) -> Result<T, WrapperError>
    where
        T: DeserializeOwned + std::fmt::Debug,
    {
        let result = self.invoke_no_decode(method, args)?;

        Ok(rmp_serde::decode::from_slice::<T>(&result)?)
    }

    pub fn invoke_no_decode(
        &mut self,
        method: &str,
        args: &Vec<u8>,
    ) -> Result<Vec<u8>, WrapperError> {
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

        let wasm_module = self.get_wasm_module()?;

        let mut wasm_instance = WasmInstance::new(wasm_module, Arc::clone(&state), abort.clone())
            .unwrap();

        let mut result: [Val; 1] = [Val::I32(0)];
        wasm_instance
            .call_export("_wrap_invoke", params, &mut result)?;

        let state_guard = state.lock().unwrap();

        if result[0].unwrap_i32() == 1 {
            if state_guard.invoke.result.is_none() {
                abort("Invoke result is missing".to_string());
            }

            Ok(state_guard.invoke.result.as_ref().unwrap().to_vec())
        } else {
            if state_guard.invoke.error.as_ref().is_none() {
                abort("Invoke error is missing".to_string());
            }

            Err(WrapperError::InvokeError(
                state_guard.invoke.error.as_ref().unwrap().to_string(),
            ))
        }
    }

    fn get_wasm_module(&mut self) -> Result<&WasmModule, WrapperError> {
        if self.wasm_module.is_none() {
            let file_content = self.file_reader.read_file("wrap.wasm");

            match file_content {
                Ok(content) => {
                    self.wasm_module = Some(WasmModule::Bytes(content.clone()));
                }
                Err(err) => {
                    return Err(WrapperError::FileReadError(err));
                }
            }
        }

        Ok(self.wasm_module.as_ref().unwrap())
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn invoke_test() {
      let mut wasm_wrapper = crate::wasm_wrapper::WasmWrapper::new(crate::wasm_wrapper::WasmWrapperConfig {
          file_reader: crate::file_reader::BaseFileReader {},
      });
      
      let invoke_result = wasm_wrapper.invoke::<String>(
          "method",
          &vec![
              130, 164, 97, 114, 103, 49, 179, 49, 50, 51, 52, 46, 53, 54, 55, 56, 57, 49, 50, 51,
              52, 53, 54, 55, 56, 57, 163, 111, 98, 106, 129, 165, 112, 114, 111, 112, 49, 179, 57,
              56, 46, 55, 54, 53, 52, 51, 50, 49, 57, 56, 55, 54, 53, 52, 51, 50, 49,
          ],
      );
  
      assert_eq!(invoke_result.unwrap(), "121932.631356500531347203169112635269");
  }
}
