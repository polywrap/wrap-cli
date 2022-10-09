#[macro_export]
macro_rules! wrap_import {
    ($arc_store:ident, $arc_state:ident, $arc_memory:ident, |$($arg:ident : $argtype:ty),*| $body:expr) => {
      #[allow(unused_mut, unused_parens)]  
      move |$($arg:$argtype),*| {
        let mut store = $arc_store.lock().unwrap();
        let mut state = $arc_state.lock().unwrap();
        let memory = $arc_memory.lock().unwrap();

        $body
      }
    };
}