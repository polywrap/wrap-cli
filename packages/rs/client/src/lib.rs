use std::collections::HashMap;
use wasmtime::*;

type InvokeResult = Result<Vec<u8>, Box<dyn std::error::Error>>;
struct InvocableResult {
  result: InvokeResult,
  encoded: Option<bool>
}

enum Args {
  Bytes(Vec<u8>),
  Map(HashMap<String, String>),
}

enum WasmModule {
  Bytes(Vec<u8>),
  Wat(String),
}

struct InvokeOptions {
}

struct WasmWrapper {
  wasm_module: WasmModule
}

impl WasmWrapper {
  pub fn new(wasm_module: WasmModule) -> Self {
    Self { wasm_module }
  }

  pub async fn invoke(&self, options: InvokeOptions) -> Result<(), Box<dyn std::error::Error>> {
    let mut config = Config::new();
    config.async_support(true);
    let engine = Engine::new(&config).unwrap();
    
    let mut store = Store::new(&engine, 4);

    let before = Func::wrap(&mut store, |_: Caller<'_, u32>| {
      println!("BEFORE");
    });
    let sleep = Func::wrap1_async(&mut store, |_: Caller<'_, u32>, millis: i32| Box::new(async move {
      println!("SLEEPING {}", millis);
      tokio::time::sleep(std::time::Duration::from_millis(millis as u64)).await;
      println!("DONE SLEEPING");
    }));
    let after = Func::wrap(&mut store, |_: Caller<'_, u32>| {
      println!("AFTER");
    });

    
    // let memory_ty = MemoryType::new(1, None);
    // let memory = Memory::new(&mut store, memory_ty)?;

    let module = match self.wasm_module {
      WasmModule::Bytes(ref bytes) => Module::new(&engine, bytes)?,
      WasmModule::Wat(ref wat) => Module::new(&engine, wat)?,
    };

    let instance = Instance::new_async(&mut store, &module, &[
      before.into(),
      sleep.into(),
      after.into(),
      // memory.into(),
    ]).await?;

    let export_func: Func = match instance.get_export(&mut store, "main").unwrap() {
      Extern::Func(f) => f,
      _ => panic!("expected function"),
    };

    let mut results = [];

    export_func.call_async(&mut store, &[], &mut results).await?;

    Ok(())
  }
}

#[tokio::main]
pub async fn main() {
  let wat = r#"
      (module
        (import "env" "before" (func $before))
        (import "env" "sleep" (func $sleep (param i32)))
        (import "env" "after" (func $after))
        (memory 1 1)
        (export "memory" (memory 0))
        (export "main" (func $main))
        (func $main
          (call $before)
          (call $sleep (i32.const 2000))
          (call $after)
        )
      )
    "#;

    let wrapper = WasmWrapper::new(WasmModule::Wat(wat.to_string()));
    wrapper.invoke(InvokeOptions { }).await.unwrap();
}

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
      crate::main();
  }
}