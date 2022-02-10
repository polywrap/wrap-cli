use polywrap_wasm_rs::{BigInt, Context, Write, WriteEncoder, JSON};
use std::collections::BTreeMap;

#[test]
fn test_write_bigint() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let bigint = BigInt::from(100_200_300_400_500i64);
    writer.write_bigint(&bigint).unwrap();
    assert_eq!(
        [175, 49, 48, 48, 50, 48, 48, 51, 48, 48, 52, 48, 48, 53, 48, 48],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_json() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let json = JSON::json!({ "foo": "bar", "bar": "baz" });
    writer.write_json(&json).unwrap();
    assert_eq!(
        [
            185, 123, 34, 98, 97, 114, 34, 58, 34, 98, 97, 122, 34, 44, 34, 102, 111, 111, 34, 58,
            34, 98, 97, 114, 34, 125
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

// #[test]
// fn test_write_bytes() {
//     let mut writer = WriteEncoder::new(&[], Context::new());
//     writer.write_bytes(&[1, 2, 3, 4, 5]).unwrap();
//     assert_eq!([221, 0, 0, 0, 5, 1, 2, 3, 4, 5], writer.get_buffer().as_slice());
// }

#[test]
fn test_write_array_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_array_length(&0x01).unwrap();
    assert_eq!([0x91], writer.get_buffer().as_slice());
}

// #[test]
// fn test_write_array() {
//     let mut writer = WriteEncoder::new(&[], Context::new());
//     writer
//         .write_array(&[1, 2, 3, 4, 5], |writer, item| writer.write_u8(item))
//         .unwrap();
//     assert_eq!([221, 0, 0, 0, 5, 1, 2, 3, 4, 5], writer.get_buffer().as_slice());
// }

#[test]
fn test_write_map_length() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_map_length(&0x01).unwrap();
    assert_eq!([0x81], writer.get_buffer().as_slice());
}

// #[test]
// fn test_write_map() {
//     let mut writer = WriteEncoder::new(&[], Context::new());
//     let mut map: BTreeMap<String, Vec<i32>> = BTreeMap::new();
//     let _ = map.insert("Polywrap".to_string(), vec![3, 5, 9]);
//     let _ = map.insert("Rust".to_string(), vec![1, 4, 7]);
//     writer
//         .write_map(
//             &map,
//             |writer, key| writer.write_string(key),
//             |writer, value| writer.write_array(value, |writer, item| writer.write_i32(item)),
//         )
//         .unwrap();
//     assert_eq!(
//         [
//             223, 0, 0, 0, 2, 168, 80, 111, 108, 121, 119, 114, 97, 112, 221, 0, 0, 0, 3, 3, 5, 9,
//             164, 82, 117, 115, 116, 221, 0, 0, 0, 3, 1, 4, 7
//         ],
//         writer.get_buffer().as_slice()
//     );
// }

#[test]
fn test_write_nil_with_empty_buffer() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    assert!(writer.get_buffer().is_empty());
    assert!(writer.write_nil().err().is_none());
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
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bool(&false).unwrap();
    assert_eq!([194], writer.get_buffer().as_slice());
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
