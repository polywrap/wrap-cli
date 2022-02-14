use polywrap_wasm_rs::{BigInt, Context, Write, WriteEncoder, JSON};
// use std::collections::BTreeMap;

#[test]
fn test_write_bigint() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let bigint = BigInt::from(170_141_183_460_469_231_731_687_303_715_884_105_727i128); // i128::MAX

    // the `BigInt` will be converted to a `String` internally: "170141183460469231731687303715884105727"
    println!("{:#?}", bigint.to_string());

    writer.write_bigint(&bigint).unwrap();
    assert_eq!(
        [
            217, 39, 49, 55, 48, 49, 52, 49, 49, 56, 51, 52, 54, 48, 52, 54, 57, 50, 51, 49, 55,
            51, 49, 54, 56, 55, 51, 48, 51, 55, 49, 53, 56, 56, 52, 49, 48, 53, 55, 50, 55
        ],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_json() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let json = JSON::json!({ "language": "rust", "edition": "2021" });

    // the `JSON` will be converted to a `String` internally: "{\"edition\":\"2021\",\"language\":\"rust\"}"
    println!("{:#?}", json.to_string());

    writer.write_json(&json).unwrap();
    assert_eq!(
        [
            217, 36, 123, 34, 101, 100, 105, 116, 105, 111, 110, 34, 58, 34, 50, 48, 50, 49, 34,
            44, 34, 108, 97, 110, 103, 117, 97, 103, 101, 34, 58, 34, 114, 117, 115, 116, 34, 125
        ],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_string() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer
        .write_string(&String::from("Polywrap wasm-rs runtime"))
        .unwrap();
    assert_eq!(
        [
            184, 80, 111, 108, 121, 119, 114, 97, 112, 32, 119, 97, 115, 109, 45, 114, 115, 32,
            114, 117, 110, 116, 105, 109, 101
        ],
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
    let mut writer = WriteEncoder::new(&[], Context::new());
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
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_i8(&(-1)).unwrap();
    assert_eq!([255], writer.get_buffer().as_slice());
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

#[test]
fn write_unsigned_int() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    // u64::MAX == 18446744073709551615
    writer.write_unsigned_int(&u64::MAX).unwrap();
    assert_eq!(
        [207, 255, 255, 255, 255, 255, 255, 255, 255],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn write_signed_int() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    // i64::MAX == 9_223_372_036_854_775_807i64
    writer
        .write_signed_int(&9_223_372_036_854_775_807i64)
        .unwrap();
    assert_eq!(
        [207, 127, 255, 255, 255, 255, 255, 255, 255],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_f32() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_f32(&0.5_f32).unwrap();
    assert_eq!([202, 63, 0, 0, 0], writer.get_buffer().as_slice())
}

#[test]
fn test_write_f64() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_f64(&3.141592653589793_f64).unwrap();
    assert_eq!(
        [203, 64, 9, 33, 251, 84, 68, 45, 24],
        writer.get_buffer().as_slice()
    )
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
