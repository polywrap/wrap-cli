use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{Arc, Mutex};

use tokio::runtime::Runtime;
use wasmtime::*;

use crate::error::WrapperError;
use crate::utils::index_of_array;

pub struct WasmInstance {
    rt: Arc<Runtime>,
    instance: Instance,
    pub shared_state: Arc<Mutex<State>>,
    store: Store<u32>,
    pub module: Module,
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

#[repr(C)]
#[derive(Default)]
pub struct State {
    pub method: Vec<u8>,
    pub args: Vec<u8>,
    pub invoke: InvokeState,
}

impl WasmInstance {
    pub fn new(
        wasm_module: &WasmModule,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
    ) -> Result<Self, WrapperError> {
        let rt = Arc::new(
            tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap(),
        );
        let mut config = Config::new();
        config.async_support(true);

        let engine =
            Engine::new(&config).map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;
        let mut linker = wasmtime::Linker::new(&engine);

        let mut store = Store::new(&engine, 4);
        let module_result = match wasm_module {
            WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes),
            WasmModule::Wat(ref wat) => Module::new(&engine, wat),
            WasmModule::Path(ref path) => Module::from_file(&engine, path),
        };

        let module = module_result.map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;
        let module_bytes = module
            .serialize()
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        let memory = Rc::new(RefCell::new(WasmInstance::create_memory(
            module_bytes.as_ref(),
            &mut store,
        )?));

        Self::create_imports(&mut linker, Arc::clone(&shared_state), abort, memory)?;

        let instance = rt
            .block_on(linker.instantiate_async(store.as_context_mut(), &module))
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        Ok(Self {
            module,
            shared_state: shared_state,
            instance: instance,
            rt: Arc::clone(&rt),
            store,
        })
    }

    fn create_imports(
        linker: &mut Linker<u32>,
        shared_state: Arc<Mutex<State>>,
        abort: Arc<dyn Fn(String) + Send + Sync>,
        memory: Rc<RefCell<Memory>>,
    ) -> Result<(), WrapperError> {
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
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

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
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

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
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

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
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        linker
            .define("env", "memory", memory.borrow_mut().to_owned())
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

        linker
            .func_wrap0_async("wrap", "__wrap_async", |_| {
                Box::new(async move {
                    println!("async");
                    let resp = reqwest::get("https://httpbin.org/ip")
                        .await
                        .unwrap()
                        .text()
                        .await
                        .unwrap();
                    println!("{}", resp);
                })
            })
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;
        Ok(())
    }

    pub fn call_export(
        &mut self,
        name: &str,
        params: &[Val],
        results: &mut [Val],
    ) -> Result<(), WrapperError> {
        let export = self.instance.get_export(self.store.as_context_mut(), name);

        if export.is_none() {
            return Err(WrapperError::WasmRuntimeError(format!(
                "Export {} not found",
                name
            )));
        }

        match export.unwrap() {
            Extern::Func(func) => {
                self.rt
                    .block_on(func.call_async(self.store.as_context_mut(), params, results))
                    .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))?;

                Ok(())
            }
            _ => panic!("Export is not a function"),
        }
    }

    fn create_memory(module_bytes: &[u8], store: &mut Store<u32>) -> Result<Memory, WrapperError> {
        const ENV_MEMORY_IMPORTS_SIGNATURE: [u8; 11] = [
            0x65, 0x6e, 0x76, 0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02,
        ];

        let sig_idx = index_of_array(module_bytes, &ENV_MEMORY_IMPORTS_SIGNATURE);

        if sig_idx.is_none() {
            return Err(WrapperError::ModuleReadError(format!(
                r#"Unable to find Wasm memory import section.
            Modules must import memory from the "env" module's
            "memory" field like so:
            (import "env" "memory" (memory (;0;) #))"#
            )));
        }

        let memory_initial_limits =
            module_bytes[sig_idx.unwrap() + ENV_MEMORY_IMPORTS_SIGNATURE.len() + 1];
        let memory_type = MemoryType::new(memory_initial_limits.into(), Option::None);

        Memory::new(store.as_context_mut(), memory_type)
            .map_err(|e| WrapperError::WasmRuntimeError(e.to_string()))
    }
}
