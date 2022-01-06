use crate::{BigInt, Context, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

pub trait Read: Clone + Sized {
	fn read_bool(&mut self) -> Result<bool, String>;
	fn read_i8(&mut self) -> Result<i8, String>;
	fn read_i16(&mut self) -> Result<i16, String>;
	fn read_i32(&mut self) -> Result<i32, String>;
	fn read_u8(&mut self) -> Result<u8, String>;
	fn read_u16(&mut self) -> Result<u16, String>;
	fn read_u32(&mut self) -> Result<u32, String>;
	fn read_f32(&mut self) -> Result<f32, String>;
	fn read_f64(&mut self) -> Result<f64, String>;
	fn read_string_length(&mut self) -> Result<u32, String>;
	fn read_string(&mut self) -> Result<String, String>;
	fn read_bytes_length(&mut self) -> Result<u32, String>;
	fn read_bytes(&mut self) -> Result<Vec<u8>, String>;
	fn read_bigint(&mut self) -> Result<BigInt, String>;
	fn read_json(&mut self) -> Result<JSON::Value, String>;
	fn read_array_length(&mut self) -> Result<u32, String>;
	fn read_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Result<Vec<T>, String>;
	fn read_map_length(&mut self) -> Result<u32, String>;
	fn read_map<K, V>(
		&mut self,
		key_fn: impl FnMut(&mut Self) -> K,
		val_fn: impl FnMut(&mut Self) -> V,
	) -> Result<BTreeMap<K, V>, String>
	where
		K: Eq + Hash + Ord;
	fn read_nullable_bool(&mut self) -> Option<bool>;
	fn read_nullable_i8(&mut self) -> Option<i8>;
	fn read_nullable_i16(&mut self) -> Option<i16>;
	fn read_nullable_i32(&mut self) -> Option<i32>;
	fn read_nullable_u8(&mut self) -> Option<u8>;
	fn read_nullable_u16(&mut self) -> Option<u16>;
	fn read_nullable_u32(&mut self) -> Option<u32>;
	fn read_nullable_f32(&mut self) -> Option<f32>;
	fn read_nullable_f64(&mut self) -> Option<f64>;
	fn read_nullable_string(&mut self) -> Option<String>;
	fn read_nullable_bytes(&mut self) -> Option<Vec<u8>>;
	fn read_nullable_bigint(&mut self) -> Option<BigInt>;
	fn read_nullable_json(&mut self) -> Option<JSON::Value>;
	fn read_nullable_array<T>(&mut self, reader: impl FnMut(&mut Self) -> T) -> Option<Vec<T>>;
	fn read_nullable_map<K, V>(
		&mut self,
		key_fn: impl FnMut(&mut Self) -> K,
		val_fn: impl FnMut(&mut Self) -> V,
	) -> Option<BTreeMap<K, V>>
	where
		K: Eq + Hash + Ord;
	fn is_next_nil(&mut self) -> bool;
	fn is_next_string(&mut self) -> bool;
	fn context(&mut self) -> &mut Context;
}
