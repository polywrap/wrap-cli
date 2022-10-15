use wasm_instance::WasmInstance;
use libc::size_t;
use wasmtime::Val;
use std::slice;

pub mod wasm_instance;
pub mod error;
pub mod utils;

#[repr(C)]
pub enum Value {
    I32(i32),
    I64(i64),
    F32(u32),
    F64(u64),
    V128(u128)
}

#[no_mangle]
pub extern "C" fn instantiate(
    wasm_module: *const u8,
    wasm_module_len: size_t,
    shared_state: *mut u8,
    shared_state_len: size_t,
    abort: extern "C" fn(*const u8, size_t),
) -> *mut WasmInstance {
    let wasm_module = unsafe { slice::from_raw_parts(wasm_module, wasm_module_len) };
    let shared_state = unsafe { slice::from_raw_parts_mut(shared_state, shared_state_len) };
    let abort = |s: String| {
        let bytes = s.into_bytes();
        unsafe { abort(bytes.as_ptr(), bytes.len()) };
    };
    let instance = WasmInstance::new(wasm_module, shared_state, abort);
    Box::into_raw(Box::new(instance))
}

#[no_mangle]
pub extern "C" fn call_export(instance: *mut WasmInstance, name: *const String, args_ptr: *const Value, args_len: size_t) -> *mut Vec<Value> {
    let instance = unsafe {
        assert!(!instance.is_null());
        &mut *instance
    };

    let name = unsafe {
        assert!(!name.is_null());
        &*name
    };

    let args_values = unsafe {
      assert!(!args_ptr.is_null());

      slice::from_raw_parts(args_ptr, args_len as usize)
    };

    let args_vals = args_values.iter().map(|arg| {
        match arg {
            Value::I32(val) => Val::I32(*val),
            Value::I64(val) => Val::I64(*val),
            Value::F32(val) => Val::F32(*val),
            Value::F64(val) => Val::F64(*val),
            Value::V128(val) => Val::V128(*val),
        }
    }).collect::<Vec<Val>>();

    let mut results = Vec::<Val>::new();

    instance.call_export(name, args_vals.as_slice(), &mut results).unwrap();

    Box::into_raw(Box::new(results.iter().map(|val| match val {
      Val::I32(val) => Value::I32(*val),
      Val::I64(val) => Value::I64(*val),
      Val::F32(val) => Value::F32(*val),
      Val::F64(val) => Value::F64(*val),
      Val::V128(val) => Value::V128(*val),
      Val::ExternRef(_) => panic!("ExternRef not supported"),
      Val::FuncRef(_) => panic!("FuncRef not supported"),
  }).collect::<Vec<Value>>()))
}
