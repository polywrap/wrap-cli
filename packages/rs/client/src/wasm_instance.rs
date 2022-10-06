use std::cell::RefCell;
use std::collections::HashMap;
use std::error::Error;
use std::sync::{Arc, Mutex};

use wasmtime::*;
struct WasmInstance {
    shared_state: Arc<Mutex<State>>,
    store: Arc<Mutex<Store<u32>>>,
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
            store: Arc::new(Mutex::new(store)),
            shared_state: Arc::new(Mutex::new(shared_state)),
        })
    }

    pub fn create_imports(&'static self) -> Vec<Extern> {
        let mut imports = Vec::new();

        let instance_store_ref = Arc::clone(&self.store);
        let mut instance_store_guard = instance_store_ref.lock().unwrap();

        let __wrap_invoke_args = Func::wrap(
            &mut *instance_store_guard,
            |method_ptr: u32, args_ptr: u32| {
                let mut store_ref = self.store.lock().unwrap();
                let state_guard = self.shared_state.lock().unwrap();

                if state_guard.method.is_empty() {
                    panic!("{}", "__wrap_invoke_args: method is not set");
                }

                if state_guard.args.is_empty() {
                    panic!("{}", "__wrap_invoke_args: args is not set");
                }

                self.memory
                    .write(
                        &mut *store_ref,
                        method_ptr.try_into().unwrap(),
                        state_guard.method.as_bytes(),
                    )
                    .unwrap();

                self.memory
                    .write(
                        &mut *store_ref,
                        args_ptr.try_into().unwrap(),
                        state_guard.args.as_slice(),
                    )
                    .unwrap();
            },
        );

        let __wrap_invoke_result = Func::wrap(&mut *instance_store_guard, |ptr: u32, len: u32| {
            let result = &mut [];

            let mut store_ref = self.store.lock().unwrap();
            let mut state_ref = self.shared_state.lock().unwrap();

            self.memory
                .read(&mut *store_ref, ptr.try_into().unwrap(), result)
                .unwrap();

            state_ref.invoke_result = Some(result[0..len.try_into().unwrap()].to_vec());
        });

        imports
    }

    fn create_memory(store: &mut Store<u32>) -> Memory {
        let memory_ty = MemoryType::new(1, None);
        let memory = Memory::new(store, memory_ty).unwrap();
        memory
    }
}
