use super::{Context, Write};
use crate::{BigInt, JSON};
use core::hash::Hash;
use std::collections::BTreeMap;

#[derive(Clone, Debug, Default)]
pub struct WriteSizer {
	pub length: i32,
	context: Context,
}

impl WriteSizer {
	#[allow(dead_code)]
	pub fn new(context: Context) -> Self {
		Self { length: 0, context }
	}

	pub fn get_length(&self) -> i32 {
		self.length
	}
}

impl Write for WriteSizer {
	fn write_nil(&mut self) {
		self.length += 1;
	}

	fn write_bool(&mut self, _value: &bool) {
		self.length += 1;
	}

	fn write_i8(&mut self, value: &i8) {
		self.write_i32(&(*value as i32));
	}

	fn write_i16(&mut self, value: &i16) {
		self.write_i32(&(*value as i32));
	}

	fn write_i32(&mut self, value: &i32) {
		if *value >= -(1 << 5) && *value < 1 << 7 {
			self.length += 1;
		} else if *value < 1 << 7 && *value >= -(1 << 7) {
			self.length += 2;
		} else if *value < 1 << 15 && *value >= -(1 << 15) {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_u8(&mut self, value: &u8) {
		self.write_u32(&(*value as u32));
	}

	fn write_u16(&mut self, value: &u16) {
		self.write_u32(&(*value as u32));
	}

	fn write_u32(&mut self, value: &u32) {
		if *value < (1 << 7) {
			self.length += 1;
		} else if *value < (1 << 8) {
			self.length += 2;
		} else if *value < (1 << 16) {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_f32(&mut self, _value: &f32) {
		self.length += 5;
	}

	fn write_f64(&mut self, _value: &f64) {
		self.length += 9;
	}

	fn write_string_length(&mut self, length: u32) {
		if length < 32 {
			self.length += 1;
		} else if length <= u8::MAX as u32 {
			self.length += 2;
		} else if length <= u16::MAX as u32 {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_string(&mut self, value: &String) {
		self.write_string_length(value.len() as u32);
		self.length += value.len() as i32;
	}

	fn write_str(&mut self, value: &str) {
		self.write_string_length(value.len() as u32);
		self.length += value.len() as i32;
	}

	fn write_bytes_length(&mut self, length: u32) {
		if length <= u8::MAX as u32 {
			self.length += 2;
		} else if length <= u16::MAX as u32 {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_bytes(&mut self, value: &[u8]) {
		if value.is_empty() {
			self.length += 1;
		} else {
			self.write_bytes_length(value.len() as u32);
			self.length += value.len() as i32;
		}
	}

	fn write_bigint(&mut self, value: &BigInt) {
		self.write_string(&value.to_string());
	}

	fn write_json(&mut self, value: &JSON::Value) {
		let res: Result<String, JSON::Error> = JSON::from_value(value.clone());
		match res {
			Ok(s) => self.write_string(&s),
			Err(_e) => {},
		}
	}

	fn write_array_length(&mut self, length: u32) {
		if length < 16 {
			self.length += 1;
		} else if length <= u16::MAX as u32 {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_array<T: Clone>(&mut self, a: &[T], mut arr_fn: impl FnMut(&mut Self, &T)) {
		self.write_array_length(a.len() as u32);
		for element in a {
			arr_fn(self, element);
		}
	}

	fn write_map_length(&mut self, length: u32) {
		if length < 16 {
			self.length += 1;
		} else if length <= u16::MAX as u32 {
			self.length += 3;
		} else {
			self.length += 5;
		}
	}

	fn write_map<K, V: Clone>(
		&mut self,
		map: &BTreeMap<K, V>,
		mut key_fn: impl FnMut(&mut Self, &K),
		mut val_fn: impl FnMut(&mut Self, &V),
	) where
		K: Clone + Eq + Hash + Ord,
	{
		self.write_map_length(map.len() as u32);
		let keys: Vec<_> = map.keys().into_iter().collect();
		for key in keys {
			let value = map.get(key).unwrap();
			key_fn(self, key);
			val_fn(self, value);
		}
	}

	fn write_nullable_bool(&mut self, value: &Option<bool>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_bool(v),
		}
	}

	fn write_nullable_i8(&mut self, value: &Option<i8>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_i8(v),
		}
	}

	fn write_nullable_i16(&mut self, value: &Option<i16>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_i16(v),
		}
	}

	fn write_nullable_i32(&mut self, value: &Option<i32>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_i32(v),
		}
	}

	fn write_nullable_u8(&mut self, value: &Option<u8>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_u8(v),
		}
	}

	fn write_nullable_u16(&mut self, value: &Option<u16>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_u16(v),
		}
	}

	fn write_nullable_u32(&mut self, value: &Option<u32>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_u32(v),
		}
	}

	fn write_nullable_f32(&mut self, value: &Option<f32>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_f32(v),
		}
	}

	fn write_nullable_f64(&mut self, value: &Option<f64>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_f64(v),
		}
	}

	fn write_nullable_string(&mut self, value: &Option<String>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_string(v),
		}
	}

	fn write_nullable_bytes(&mut self, value: &Option<Vec<u8>>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_bytes(v),
		}
	}

	fn write_nullable_bigint(&mut self, value: &Option<BigInt>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_bigint(v),
		}
	}

	fn write_nullable_json(&mut self, value: &Option<JSON::Value>) {
		match value {
			None => self.write_nil(),
			Some(v) => self.write_json(v),
		}
	}

	fn write_nullable_array<T: Clone>(
		&mut self,
		a: &Option<Vec<T>>,
		arr_fn: impl FnMut(&mut Self, &T),
	) {
		match a {
			None => self.write_nil(),
			Some(v) => self.write_array(v, arr_fn),
		}
	}

	fn write_nullable_map<K, V: Clone>(
		&mut self,
		map: &Option<BTreeMap<K, V>>,
		key_fn: impl FnMut(&mut Self, &K),
		val_fn: impl FnMut(&mut Self, &V),
	) where
		K: Clone + Eq + Hash + Ord,
	{
		match map {
			None => self.write_nil(),
			Some(v) => self.write_map(v, key_fn, val_fn),
		}
	}

	fn context(&mut self) -> &mut Context {
		&mut self.context
	}
}
