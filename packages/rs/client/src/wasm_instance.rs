use std::error::Error;
use std::sync::{Arc, Mutex};

use wasmtime::*;
pub struct WasmInstance {
    instance: Instance,
    shared_state: Arc<Mutex<State>>,
    store: Store<u32>,
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
        let mut linker = wasmtime::Linker::new(&engine);

        let mut store = Store::new(&engine, 4);

        let mut memory = Memory::new(&mut store, MemoryType::new(1, Option::None)).unwrap();

        let module = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes)?,
            WasmModule::Wat(ref wat) => Module::new(&engine, wat)?,
            WasmModule::Path(ref path) => Module::from_file(&engine, path)?,
        };

        Self::create_imports(
            &mut linker,
            Arc::clone(&shared_state),
            abort,
            &mut memory,
        );

        let instance = linker
            .instantiate_async(store.as_context_mut(), &module)
            .await
            .unwrap();

        Ok(Self {
            module,
            shared_state: shared_state,
            instance: instance,
            store
        })
    }

    fn create_imports(
        linker: &mut Linker<u32>,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
        memory: &mut Memory,
    ) -> () {
        let arc_shared_state = Arc::clone(&shared_state);
        // let arc_memory = Arc::clone(&memory);
        let abort_clone = Arc::clone(&abort);

        linker
            .func_wrap(
                "wrap",
                "__wrap_invoke_args",
                move |mut caller: Caller<'_, u32>, method_ptr: u32, args_ptr: u32| {
                    dbg!("__wrap_invoke_args");
                    let state_guard = arc_shared_state.lock().unwrap();
                    let memory = caller.get_export("memory").unwrap().into_memory().unwrap();

                    if state_guard.method.is_empty() {
                        abort_clone(format!("{}", "__wrap_invoke_args: method is not set"));
                    }

                    if state_guard.args.is_empty() {
                        abort_clone(format!("{}", "__wrap_invoke_args: args is not set"));
                    }

                    memory
                        .write(
                            caller.as_context_mut(),
                            method_ptr.try_into().unwrap(),
                            state_guard.method.as_slice(),
                        )
                        .unwrap();

                    memory
                        .write(
                            caller.as_context_mut(),
                            args_ptr.try_into().unwrap(),
                            state_guard.args.as_slice(),
                        )
                        .unwrap();
                },
            )
            .unwrap();

        let arc_shared_state = Arc::clone(&shared_state);

        linker
            .func_wrap(
                "wrap",
                "__wrap_invoke_result",
                move |mut caller: Caller<'_, u32>, ptr: u32, len: u32| {
                    dbg!("__wrap_invoke_result");
                    let result = &mut [];

                    let mut state_ref = arc_shared_state.lock().unwrap();
                    let memory_guard = caller.get_export("memory").unwrap().into_memory().unwrap();

                    memory_guard
                        .read(caller, ptr.try_into().unwrap(), result)
                        .unwrap();

                    state_ref.invoke_result = Some(result[0..len.try_into().unwrap()].to_vec());
                },
            )
            .unwrap();

        let arc_shared_state = Arc::clone(&shared_state);

        linker.func_wrap(
            "wrap",
            "__wrap_invoke_error",
            move |mut caller: Caller<'_, u32>, ptr: u32, len: u32| {
                dbg!("__wrap_invoke_error");
                let mut state_ref = arc_shared_state.lock().unwrap();
                let memory_guard = caller.get_export("memory").unwrap().into_memory().unwrap();

                let string_buf = &mut [];

                memory_guard
                    .read(caller, ptr.try_into().unwrap(), string_buf)
                    .unwrap();

                state_ref.invoke.error = Some(
                    String::from_utf8(string_buf[0..len.try_into().unwrap()].to_vec()).unwrap(),
                );
            },
        ).unwrap();

        let abort_clone = Arc::clone(&abort);

        linker.func_wrap(
            "wrap", "__wrap_abort",
            move |
                  mut caller: Caller<'_, u32>,
                  msg_ptr: u32,
                  msg_len: u32,
                  file_ptr: u32,
                  file_len: u32,
                  line: u32,
                  column: u32| {
                dbg!("__wrap_abort");
                let msg_buff = &mut [];
                let file_buff = &mut [];

                let memory = caller.get_export("memory").unwrap().into_memory().unwrap();

                memory
                    .read(caller.as_context_mut(), msg_ptr.try_into().unwrap(), msg_buff)
                    .unwrap();
                memory
                    .read(caller.as_context_mut(), file_ptr.try_into().unwrap(), file_buff)
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
        ).unwrap();

        linker.define("env", "memory", *memory).unwrap();
    }

    pub async fn call_export(&mut self, name: &str, params: &[Val], results: &mut [Val]) -> () {
        let export = self.instance.get_export(self.store.as_context_mut(), name).unwrap();

        match export {
            Extern::Func(func) => {
                func.call_async(self.store.as_context_mut(), params, results)
                    .await
                    .unwrap();
            }
            _ => panic!("Export is not a function"),
        }
    }
}
