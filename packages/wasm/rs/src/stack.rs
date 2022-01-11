use std::{env, ffi::OsStr, ops::Drop, thread};

const STACK_ENV_VAR: &str = "RUST_MIN_STACK";
const EXTRA_STACK: &str = "20777216"; // 20 MB

/// Runs a function in a thread with extra stack space (20 MB or
/// `$RUST_MIN_STACK` if set).
///
/// The Rust parser uses a lot of stack space so codegen sometimes requires more
/// than is available by default.
///
/// ```rust,ignore
/// use polywrap_wasm_rs::{self, Context, WriteEncoder, Write, EncodingError}
/// polywrap_wasm_rs::spawn_thread_with_extra_stack(move || {
///     let mut writer = polywrap_wasm_rs::WriteEncoder::new(&[], Context::new());
///     let _ = writer.write_nil();
/// })
/// ```
///
/// This function runs with a 20 MB stack by default but a different value can
/// be set by the RUST_MIN_STACK environment variable.
pub fn spawn_thread_with_extra_stack<F, T>(f: F) -> T
where
	F: Send + 'static + FnOnce() -> T,
	T: Send + 'static,
{
	let _tmp_env = set_stack_size_if_unset(STACK_ENV_VAR, EXTRA_STACK);

	thread::spawn(f).join().unwrap()
}

fn set_stack_size_if_unset<K, V>(k: K, v: V) -> TmpEnv<K>
where
	K: AsRef<OsStr>,
	V: AsRef<OsStr>,
{
	match env::var(&k) {
		Ok(_) => TmpEnv::StackSizeAlreadySet,
		Err(_) => {
			env::set_var(&k, v);
			TmpEnv::StackSizeNotSet(k)
		},
	}
}

#[must_use]
enum TmpEnv<K>
where
	K: AsRef<OsStr>,
{
	StackSizeAlreadySet,
	StackSizeNotSet(K),
}

impl<K> Drop for TmpEnv<K>
where
	K: AsRef<OsStr>,
{
	fn drop(&mut self) {
		if let TmpEnv::StackSizeNotSet(ref k) = *self {
			env::remove_var(k);
		}
	}
}
