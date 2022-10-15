use libc::size_t;
use std::{ffi::{c_char, CStr, CString}, slice, ptr, sync::Arc};
use wasm_instance::WasmInstance;
use wasmtime::Val;

pub mod error;
pub mod state;
pub mod utils;
pub mod wasm_instance;

#[repr(C)]
pub enum Value {
    I32(i32),
    I64(i64),
    F32(u32),
    F64(u64),
    V128(u128),
}

#[no_mangle]
pub extern "C" fn instantiate(
    wasm_module: *const u8,
    wasm_module_len: size_t,
    abort: extern "C" fn(*const u8, size_t),
) -> *mut WasmInstance {
    let wasm_module = unsafe { slice::from_raw_parts(wasm_module, wasm_module_len) };
    let abort = move |s: String| {
        let bytes = s.into_bytes();
        abort(bytes.as_ptr(), bytes.len());
    };
    let arc_abort = Arc::new(abort);
    let instance = WasmInstance::new(wasm_module, arc_abort).unwrap();
    Box::into_raw(Box::new(instance))
}

#[no_mangle]
pub extern "C" fn call_export(
    instance: *mut WasmInstance,
    name: *const String,
    args_ptr: *const Value,
    args_len: size_t,
) -> *mut Vec<Value> {
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

    let args_vals = args_values
        .iter()
        .map(|arg| match arg {
            Value::I32(val) => Val::I32(*val),
            Value::I64(val) => Val::I64(*val),
            Value::F32(val) => Val::F32(*val),
            Value::F64(val) => Val::F64(*val),
            Value::V128(val) => Val::V128(*val),
        })
        .collect::<Vec<Val>>();

    let mut results = Vec::<Val>::new();

    instance
        .call_export(name, args_vals.as_slice(), &mut results)
        .unwrap();

    Box::into_raw(Box::new(
        results
            .iter()
            .map(|val| match val {
                Val::I32(val) => Value::I32(*val),
                Val::I64(val) => Value::I64(*val),
                Val::F32(val) => Value::F32(*val),
                Val::F64(val) => Value::F64(*val),
                Val::V128(val) => Value::V128(*val),
                Val::ExternRef(_) => panic!("ExternRef not supported"),
                Val::FuncRef(_) => panic!("FuncRef not supported"),
            })
            .collect::<Vec<Value>>(),
    ))
}

#[no_mangle]
pub extern "C" fn set_method(instance: *mut WasmInstance, method: *const c_char) {
    let c_method = unsafe {
        assert!(!method.is_null());
        CStr::from_ptr(method)
    };

    let method = c_method.to_str().unwrap();

    let instance = unsafe {
        assert!(!instance.is_null());
        &mut *instance
    };

    let mut state = instance.shared_state.lock().unwrap();
    state.method = method.as_bytes().to_vec();
}

#[no_mangle]
pub extern "C" fn set_args(instance: *mut WasmInstance, args: *const u8, args_len: size_t) {
    let args = unsafe {
        assert!(!args.is_null());
        slice::from_raw_parts(args, args_len)
    };

    let instance = unsafe {
        assert!(!instance.is_null());
        &mut *instance
    };

    let mut state = instance.shared_state.lock().unwrap();
    state.args = args.to_vec();
}

#[no_mangle]
pub extern "C" fn get_result(instance: *mut WasmInstance, buf: *mut u8, buf_len: size_t) {
    let instance = unsafe {
        assert!(!instance.is_null());
        &mut *instance
    };

    let state = instance.shared_state.lock().unwrap();

    let result = state.invoke.result.as_ref().unwrap();

    unsafe {
        let result_len = (*result).len();
        if buf_len < result_len {
            panic!(
                "Passed buffer is too small to hold the result. Buffer size: {}, result size: {}",
                buf_len, result_len
            );
        }

        ptr::copy_nonoverlapping(&(*result)[0], buf, result_len);
    }
}

#[no_mangle]
pub extern "C" fn get_error(instance: *mut WasmInstance) -> *const c_char {
    let instance = unsafe {
        assert!(!instance.is_null());
        &mut *instance
    };

    let state = instance.shared_state.lock().unwrap();

    let error = state.invoke.error.as_ref().unwrap();
    let error_str = CString::new(error.clone()).unwrap();
    let error_ptr = error_str.as_ptr();

    std::mem::forget(error_str);

    error_ptr
}
