use std::collections::HashMap;
use std::{
    error::Error,
};

use wasmtime::*;
struct WasmInstance {
    shared_state: State,
    store: Store<u32>,
    memory: Memory,
}

enum Args {
    Bytes(Vec<u8>),
    Map(HashMap<String, String>),
}

enum WasmModule {
    Bytes(Vec<u8>),
    Wat(String),
}

#[derive(Default)]
struct SubInvokeState {
    result: Option<Vec<u8>>,
    error: Option<String>,
    args: Vec<Args>,
}

#[derive(Default)]
struct InvokeState {
    result: Option<Vec<u8>>,
    error: Option<String>,
}

#[derive(Default)]
pub struct State {
    method: String,
    args: Vec<u8>,
    invoke: InvokeState,
    subinvoke: SubInvokeState,
    subinvoke_implementation: SubInvokeState,
    invoke_result: Option<Vec<u8>>,
    get_implementations_result: Option<Vec<u8>>,
    env: Vec<u8>,
}

impl WasmInstance {
    pub async fn new(wasm_module: WasmModule, shared_state: State) -> Result<Self, Box<dyn Error>> {
        let mut config = Config::new();
        config.async_support(true);

        let engine = Engine::new(&config).unwrap();
        let mut store = Store::new(&engine, 4);

        let memory = Self::create_memory(&mut store);

        let module = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes)?,
            WasmModule::Wat(ref wat) => Module::new(&engine, wat)?,
        };

        let instance = Instance::new_async(&mut store, &module, &[]).await?;

        Ok(Self {
            memory,
            store: store,
            shared_state: shared_state,
        })
    }

    pub fn create_imports(&mut self) -> Vec<Extern> {
        let mut imports = Vec::new();

        let __wrap_invoke_args = Func::wrap(self.store, |method_ptr: u32, args_ptr: u32| {
            if self.shared_state.method.is_empty() {
                panic!("{}", "__wrap_invoke_args: method is not set");
            }

            if self.shared_state.args.is_empty() {
                panic!("{}", "__wrap_invoke_args: args is not set");
            }

            self.memory
                .write(
                    self.store,
                    method_ptr.try_into().unwrap(),
                    self.shared_state.method.as_bytes(),
                )
                .unwrap();
            self.memory
                .write(
                    self.store,
                    args_ptr.try_into().unwrap(),
                    self.shared_state.args.as_slice(),
                )
                .unwrap();
        });

        let __wrap_invoke_result = Func::wrap(self.store, |ptr: u32, len: u32| {
            let result = &mut [];
            self.memory
                .read(self.store, ptr.try_into().unwrap(), result)
                .unwrap();

            self.shared_state.invoke_result = Some(result[0..len.try_into().unwrap()].to_vec());
        });

        imports
    }

    fn create_memory(store: &mut Store<u32>) -> Memory {
        let memory_ty = MemoryType::new(1, None);
        let memory = Memory::new(store, memory_ty).unwrap();
        memory
    }
}
