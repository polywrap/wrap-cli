use std::error::Error;
use std::sync::{Arc, Mutex};

use wasmtime::*;
pub struct WasmInstance {
    instance: Instance,
    shared_state: Arc<Mutex<State>>,
    store: Arc<Mutex<Store<u32>>>,
    memory: Arc<Mutex<Memory>>,
    module: Module,
}

pub enum WasmModule {
    Bytes(Vec<u8>),
    Wat(String),
    Path(String),
}

#[derive(Default)]
pub struct InvokeState {
    result: Option<Vec<u8>>,
    error: Option<String>,
}

#[derive(Default)]
pub struct State {
    pub method: Vec<u8>,
    pub args: Vec<u8>,
    pub invoke: InvokeState,
    pub invoke_result: Option<Vec<u8>>,
}

impl WasmInstance {
    pub async fn new(
        wasm_module: WasmModule,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
    ) -> Result<Self, Box<dyn Error>> {
        let mut config = Config::new();
        config.async_support(true);

        let engine = Engine::new(&config).unwrap();
        let mut store = Store::new(&engine, 4);

        let memory = Self::create_memory(&mut store);

        let module = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes)?,
            WasmModule::Wat(ref wat) => Module::new(&engine, wat)?,
            WasmModule::Path(ref path) => Module::from_file(&engine, path)?,
        };

        let arc_store = Arc::new(Mutex::new(store));
        let arc_memory = Arc::new(Mutex::new(memory));

        let imports = Self::create_imports(
            Arc::clone(&arc_store),
            Arc::clone(&shared_state),
            Arc::clone(&arc_memory),
            abort,
        );

        let instance =
            Instance::new_async(&mut *arc_store.lock().unwrap(), &module, &imports).await?;

        Ok(Self {
            module,
            memory: arc_memory,
            store: arc_store,
            shared_state: shared_state,
            instance: instance,
        })
    }

    fn create_imports(
        store: Arc<Mutex<Store<u32>>>,
        shared_state: Arc<Mutex<State>>,
        memory: Arc<Mutex<Memory>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
    ) -> [Extern; 5] {
        let instance_store_ref = Arc::clone(&store);
        let mut instance_store_guard = instance_store_ref.lock().unwrap();

        let arc_store = Arc::clone(&store);
        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&memory);
        let abort_clone = Arc::clone(&abort);

        let __wrap_invoke_args = Func::wrap(
            &mut *instance_store_guard,
            move |method_ptr: u32, args_ptr: u32| {
                let mut store_ref = arc_store.lock().unwrap();
                let state_guard = arc_shared_state.lock().unwrap();
                let memory_guard = arc_memory.lock().unwrap();

                if state_guard.method.is_empty() {
                    abort_clone(format!("{}", "__wrap_invoke_args: method is not set"));
                }

                if state_guard.args.is_empty() {
                    abort_clone(format!("{}", "__wrap_invoke_args: args is not set"));
                }

                memory_guard
                    .write(
                        &mut *store_ref,
                        method_ptr.try_into().unwrap(),
                        state_guard.method.as_slice(),
                    )
                    .unwrap();

                memory_guard
                    .write(
                        &mut *store_ref,
                        args_ptr.try_into().unwrap(),
                        state_guard.args.as_slice(),
                    )
                    .unwrap();
            },
        );

        let arc_store = Arc::clone(&store);
        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&memory);

        let __wrap_invoke_result =
            Func::wrap(&mut *instance_store_guard, move |ptr: u32, len: u32| {
                let result = &mut [];

                let mut store_ref = arc_store.lock().unwrap();
                let mut state_ref = arc_shared_state.lock().unwrap();
                let memory_guard = arc_memory.lock().unwrap();

                memory_guard
                    .read(&mut *store_ref, ptr.try_into().unwrap(), result)
                    .unwrap();

                state_ref.invoke_result = Some(result[0..len.try_into().unwrap()].to_vec());
            });

        let arc_store = Arc::clone(&store);
        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&memory);

        let __wrap_invoke_error =
            Func::wrap(&mut *instance_store_guard, move |ptr: u32, len: u32| {
                let mut store_ref = arc_store.lock().unwrap();
                let mut state_ref = arc_shared_state.lock().unwrap();
                let memory_guard = arc_memory.lock().unwrap();

                let string_buf = &mut [];

                memory_guard
                    .read(&mut *store_ref, ptr.try_into().unwrap(), string_buf)
                    .unwrap();

                state_ref.invoke.error = Some(
                    String::from_utf8(string_buf[0..len.try_into().unwrap()].to_vec()).unwrap(),
                );
            });

        let arc_store = Arc::clone(&store);
        let arc_memory = Arc::clone(&memory);
        let abort_clone = Arc::clone(&abort);

        let __wrap_abort = Func::wrap(
            &mut *instance_store_guard,
            move |msg_ptr: u32,
                  msg_len: u32,
                  file_ptr: u32,
                  file_len: u32,
                  line: u32,
                  column: u32| {
                let msg_buff = &mut [];
                let file_buff = &mut [];

                let memory_guard = arc_memory.lock().unwrap();
                let mut store_ref = arc_store.lock().unwrap();

                memory_guard
                    .read(&mut *store_ref, msg_ptr.try_into().unwrap(), msg_buff)
                    .unwrap();
                memory_guard
                    .read(&mut *store_ref, file_ptr.try_into().unwrap(), file_buff)
                    .unwrap();

                let msg =
                    String::from_utf8(msg_buff[0..msg_len.try_into().unwrap()].to_vec()).unwrap();
                let file =
                    String::from_utf8(file_buff[0..file_len.try_into().unwrap()].to_vec()).unwrap();

                abort_clone(format!(
                    "__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]",
                    msg = msg,
                    file = file,
                    line = line,
                    column = column
                ));
            },
        );

        [
            __wrap_abort.into(),
            __wrap_invoke_args.into(),
            __wrap_invoke_result.into(),
            __wrap_invoke_error.into(),
            wasmtime::Extern::Memory(
                memory.lock().unwrap().clone().into(),
            ),
        ]
    }

    fn create_memory(store: &mut Store<u32>) -> Memory {
        let memory_ty = MemoryType::new(1, None);
        let memory = Memory::new(store, memory_ty).unwrap();
        memory
    }

    pub async fn call_export(&self, name: &str, params: &[Val], results: &mut [Val]) -> () {
        let mut store_ref = self.store.lock().unwrap();

        let export = self.instance
            .get_export(&mut *store_ref, name)
            .unwrap();
        
        match export {
            Extern::Func(func) => {
                func.call_async(&mut *store_ref, params, results).await.unwrap();
            }
            _ => panic!("Export is not a function"),
        }
    }
}
