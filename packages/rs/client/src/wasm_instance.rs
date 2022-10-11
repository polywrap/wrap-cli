use std::cell::RefCell;
use std::error::Error;
use std::rc::Rc;
use std::sync::{Arc, Mutex};

use wasmtime::*;

use crate::WasmWrapper;
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
    pub result: Option<Vec<u8>>,
    pub error: Option<String>,
}

#[derive(Default)]
pub struct State {
    pub method: Vec<u8>,
    pub args: Vec<u8>,
    pub invoke: InvokeState,
}

impl WasmInstance {
    pub async fn new(
        wasm_module: &WasmModule,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
    ) -> Result<Self, Box<dyn Error>> {
        let mut config = Config::new();
        config.async_support(true);

        let engine = Engine::new(&config).unwrap();
        let mut linker = wasmtime::Linker::new(&engine);

        let mut store = Store::new(&engine, 4);

        let memory = Rc::new(RefCell::new(
            Memory::new(store.as_context_mut(), MemoryType::new(1, Option::None)).unwrap(),
        ));

        let module = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes)?,
            WasmModule::Wat(ref wat) => Module::new(&engine, wat)?,
            WasmModule::Path(ref path) => Module::from_file(&engine, path)?,
        };

        Self::create_imports(
            &mut linker,
            Arc::clone(&shared_state),
            abort,
            memory,
            &module,
        );

        let instance = linker
            .instantiate_async(store.as_context_mut(), &module)
            .await
            .unwrap();

        Ok(Self {
            module,
            shared_state: shared_state,
            instance: instance,
            store,
        })
    }

    fn create_imports(
        linker: &mut Linker<u32>,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
        memory: Rc<RefCell<Memory>>,
        module: &Module,
    ) -> () {
        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::new(Mutex::new(memory.borrow_mut().to_owned()));
        let mem = arc_memory.clone();
        let abort_clone = Arc::clone(&abort);

        linker
            .func_wrap(
                "wrap",
                "__wrap_invoke_args",
                move |mut caller: Caller<'_, u32>, method_ptr: u32, args_ptr: u32| {
                    let state_guard = arc_shared_state.lock().unwrap();
                    let memory = arc_memory.lock().unwrap();

                    if state_guard.method.is_empty() {
                        abort_clone(format!("{}", "__wrap_invoke_args: method is not set"));
                    }

                    if state_guard.args.is_empty() {
                        abort_clone(format!("{}", "__wrap_invoke_args: args is not set"));
                    }

                    let mem_data = memory.data_mut(caller.as_context_mut());
                    mem_data[method_ptr as usize..method_ptr as usize + state_guard.method.len()]
                        .copy_from_slice(&state_guard.method);

                    mem_data[args_ptr as usize..args_ptr as usize + state_guard.args.len()]
                        .copy_from_slice(&state_guard.args);
                },
            )
            .unwrap();

        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&mem);

        linker
            .func_wrap(
                "wrap",
                "__wrap_invoke_result",
                move |mut caller: Caller<'_, u32>, ptr: u32, len: u32| {
                    let mut state_ref = arc_shared_state.lock().unwrap();
                    let memory_guard = arc_memory.lock().unwrap();

                    let mem_data = memory_guard.data_mut(caller.as_context_mut());
                    let res = mem_data[ptr as usize..ptr as usize + len as usize].to_vec();
                    state_ref.invoke.result = Some(res);
                },
            )
            .unwrap();

        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&mem);

        linker
            .func_wrap(
                "wrap",
                "__wrap_invoke_error",
                move |mut caller: Caller<'_, u32>, ptr: u32, len: u32| {
                    dbg!("__wrap_invoke_error");
                    let mut state_ref = arc_shared_state.lock().unwrap();
                    let memory_guard = arc_memory.lock().unwrap();

                    let mem_data = memory_guard.data_mut(caller.as_context_mut());
                    let res = mem_data[ptr as usize..ptr as usize + len as usize].to_vec();
                    state_ref.invoke.error = Some(String::from_utf8(res).unwrap());
                },
            )
            .unwrap();

        let abort_clone = Arc::clone(&abort);
        let arc_memory = Arc::clone(&mem);

        linker
            .func_wrap(
                "wrap",
                "__wrap_abort",
                move |mut caller: Caller<'_, u32>,
                      msg_ptr: u32,
                      msg_len: u32,
                      file_ptr: u32,
                      file_len: u32,
                      line: u32,
                      column: u32| {
                    let memory = arc_memory.lock().unwrap();

                    let mem_data = memory.data_mut(caller.as_context_mut());
                    let msg =
                        mem_data[msg_ptr as usize..msg_ptr as usize + msg_len as usize].to_vec();
                    let file =
                        mem_data[file_ptr as usize..file_ptr as usize + file_len as usize].to_vec();
                    let msg = String::from_utf8(msg).unwrap();
                    let file = String::from_utf8(file).unwrap();

                    abort_clone(format!(
                        "__wrap_abort: {msg}\nFile: {file}\nLocation: [{line},{column}]",
                        msg = msg,
                        file = file,
                        line = line,
                        column = column
                    ));
                },
            )
            .unwrap();

        let arc_shared_state = Arc::clone(&shared_state);
        let arc_memory = Arc::clone(&mem);

        linker
            .func_wrap(
                "wrap",
                "__wrap_abort",
                move |mut caller: Caller<'_, u32>,
                      uri_ptr: u32,
                      uri_len: u32,
                      method_ptr: u32,
                      method_len: u32,
                      args_ptr: u32,
                      args_len: u32| {
                    arc_shared_state.lock().unwrap().invoke.result = None;
                    arc_shared_state.lock().unwrap().invoke.error = None;

                    let memory_guard = arc_memory.lock().unwrap();

                    let uri = String::from_utf8(
                        memory_guard.data(caller.as_context())
                            [uri_ptr as usize..uri_ptr as usize + uri_len as usize]
                            .to_vec(),
                    );
                    let method = String::from_utf8(
                        memory_guard.data(caller.as_context())
                            [method_ptr as usize..method_ptr as usize + method_len as usize]
                            .to_vec(),
                    )
                    .unwrap();
                    let args = memory_guard.data(caller.as_context())
                        [args_ptr as usize..args_ptr as usize + args_len as usize]
                        .to_vec();

                        let rt = tokio::runtime::Builder::new_current_thread()
                        .enable_all()
                        .build().unwrap();

                        rt.block_on(async {
                          let res = WasmWrapper::invoke_no_decode(
                            &WasmModule::Bytes("".to_string().into_bytes()),
                            &method,
                            args,
                        )
                        .await;
                        });
                },
            )
            .unwrap();

        linker
            .define("env", "memory", memory.borrow_mut().to_owned())
            .unwrap();
    }

    pub async fn call_export(&mut self, name: &str, params: &[Val], results: &mut [Val]) -> () {
        let export = self
            .instance
            .get_export(self.store.as_context_mut(), name)
            .unwrap();

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
