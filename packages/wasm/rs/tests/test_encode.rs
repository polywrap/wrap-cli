use polywrap_wasm_rs::{BigInt, Context, Write, WriteEncoder, JSON};
use std::collections::BTreeMap;

#[test]
fn test_write_bigint() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bigint(&BigInt::default()).unwrap();
    assert_eq!([0xa1, 0x30], writer.get_buffer().as_slice());
}

#[test]
fn test_write_json() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let json = JSON::json!({ "foo": "bar", "bar": "baz" });
    writer.write_json(&json).unwrap();
    assert_eq!(
        [
            0xb9, 0x7b, 0x22, 0x62, 0x61, 0x72, 0x22, 0x3a, 0x22, 0x62, 0x61, 0x7a, 0x22, 0x2c,
            0x22, 0x66, 0x6f, 0x6f, 0x22, 0x3a, 0x22, 0x62, 0x61, 0x72, 0x22, 0x7d
        ],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_string_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_string_length(&0x01).unwrap();
    assert_eq!([0xa1], writer.get_buffer().as_slice());
}

#[test]
fn test_write_string() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_string(&String::from("Hello")).unwrap();
    assert_eq!(
        [0xa5, 0x48, 0x65, 0x6c, 0x6c, 0x6f],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_str() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_str("Hello").unwrap();
    assert_eq!(
        [0xa5, 0x48, 0x65, 0x6c, 0x6c, 0x6f],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_bytes_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bytes_length(&0x01).unwrap();
    assert_eq!([0xc4, 0x01], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bytes() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bytes(&[0x01]).unwrap();
    assert_eq!([0xc4, 0x01, 0x01], writer.get_buffer().as_slice());
}

#[test]
fn test_write_array_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_array_length(&0x01).unwrap();
    assert_eq!([0x91], writer.get_buffer().as_slice());
}

#[test]
fn test_write_array() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer
        .write_array(&[0x01], |writer, item| writer.write_u8(item))
        .unwrap();
    assert_eq!([0x91, 0xcc, 0x01], writer.get_buffer().as_slice());
}

#[test]
fn test_write_map_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_map_length(&0x01).unwrap();
    assert_eq!([0x81], writer.get_buffer().as_slice());
}

#[test]
fn test_write_map() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let mut map: BTreeMap<String, Vec<i32>> = BTreeMap::new();
    let _ = map.insert("Polywrap".to_string(), vec![0x01, 0x02]);
    writer
        .write_map(
            &map,
            |writer, key| writer.write_string(key),
            |writer, value| writer.write_array(value, |writer, item| writer.write_i32(item)),
        )
        .unwrap();
    assert_eq!(
        [
            0x81, 0xa8, 0x50, 0x6f, 0x6c, 0x79, 0x77, 0x72, 0x61, 0x70, 0x92, 0xd2, 0x00, 0x00,
            0x00, 0x01, 0xd2, 0x00, 0x00, 0x00, 0x02
        ],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_nil_with_empty_buffer() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    assert!(writer.get_buffer().is_empty());
    assert_eq!(writer.write_nil().err(), None);
    assert_eq!(writer.get_buffer().as_slice(), [0xc0]);
}

#[test]
fn test_write_nil_with_buffer() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_nil().unwrap();
    assert_eq!([0xc0], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_true() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(&true).unwrap();
    assert_eq!([0xc3], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_false() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(&false).unwrap();
    assert_eq!([0xc2], writer.get_buffer().as_slice());
}

#[test]
fn test_write_f32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_f32(&f32::MIN).unwrap();
    assert_eq!(
        [0xca, 0xff, 0x7f, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_f64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_f64(&f64::INFINITY).unwrap();
    assert_eq!(
        [0xcb, 0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_i8(&i8::MIN).unwrap();
    assert_eq!([0xd0, 0x80], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i16() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00], Context::new());
    writer.write_i16(&i16::MIN).unwrap();
    assert_eq!([0xd1, 0x80, 0x00], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_i32(&i32::MIN).unwrap();
    assert_eq!(
        [0xd2, 0x80, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_i64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_i64(&i64::MIN).unwrap();
    assert_eq!(
        [0xd3, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_u8(&u8::MAX).unwrap();
    assert_eq!([0xcc, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u16() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00], Context::new());
    writer.write_u16(&u16::MAX).unwrap();
    assert_eq!([0xcd, 0xff, 0xff], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u32() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00, 0x00, 0x00, 0x00], Context::new());
    writer.write_u32(&u32::MAX).unwrap();
    assert_eq!(
        [0xce, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_u64() {
    let mut writer = WriteEncoder::new(
        &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        Context::new(),
    );
    writer.write_u64(&u64::MAX).unwrap();
    assert_eq!(
        [0xcf, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
        writer.get_buffer().as_slice()
    );
}
