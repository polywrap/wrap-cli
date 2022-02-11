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
fn test_write_string() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_string(&String::from("Hello")).unwrap();
    assert_eq!(
        [165, 72, 101, 108, 108, 111],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_str() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_str("Hello").unwrap();
    assert_eq!(
        [165, 72, 101, 108, 108, 111],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_nil() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_nil().unwrap();
    assert_eq!([192], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_true() {
    let mut writer = WriteEncoder::new(&[0x00], Context::new());
    writer.write_bool(&true).unwrap();
    assert_eq!([195], writer.get_buffer().as_slice());
}

#[test]
fn test_write_bool_false() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bool(&false).unwrap();
    assert_eq!([194], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_u8(&255).unwrap();
    assert_eq!([204, 255], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u16() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_u16(&65535).unwrap();
    assert_eq!([205, 255, 255], writer.get_buffer().as_slice());
}

#[test]
fn test_write_u32() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_u32(&4294967295).unwrap();
    assert_eq!([206, 255, 255, 255, 255], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i8() {
    let mut writer = WriteEncoder::new(&[0x00, 0x00], Context::new());
    writer.write_i8(&(-1)).unwrap();
    assert_eq!([255, 0], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i16() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_i16(&(-123)).unwrap();
    assert_eq!([208, 133], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i32() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_i32(&(123456)).unwrap();
    assert_eq!([206, 0, 1, 226, 64], writer.get_buffer().as_slice());
}

// #[test]
// fn test_write_bytes() {
//     let mut writer = WriteEncoder::new(&[], Context::new());
//     writer.write_bytes(&[1]).unwrap();
//     assert_eq!([196, 1, 1], writer.get_buffer().as_slice());
// }

// #[test]
// fn test_write_array() {
//     let mut writer = WriteEncoder::new(&[], Context::new());
//     let input_arr: Vec<i32> = vec![1, 2, 545345];
//     writer.write_array(&input_arr, |writer, item| writer.write_i32(item)).unwrap();
//     assert_eq!(writer.get_buffer().as_slice(), [221, 0, 0, 0, 3, 1, 2, 206, 0, 8, 82, 65]);
// }

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
