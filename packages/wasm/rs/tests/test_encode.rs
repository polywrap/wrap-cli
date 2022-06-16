use polywrap_wasm_rs::{BigInt, Context, Write, WriteEncoder, JSON};
use std::collections::BTreeMap;

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
fn test_write_fixstr() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer
        .write_string("-This string contains 31 chars-")
        .unwrap();
    assert_eq!(
        [
          191, 45, 84, 104, 105, 115, 32, 115, 116, 114, 105, 110, 103, 32, 99,
           111, 110, 116, 97, 105, 110, 115, 32, 51, 49, 32, 99, 104, 97, 114, 115, 45
        ],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn test_write_string() {
  let mut writer = WriteEncoder::new(&[], Context::new());
  writer
      .write_string(concat!("This is a str 8 string of 255 bytes ",
      "AC53LgxLLOKm0hfsPa1V0nfMjXtnmkEttruCPjc51dtEMLRJIEu1YoRGd9", "oXnM4CxcIiTc9V2DnAidZz22foIzc3kqHBoXgYskevfoJ5RK", 
      "Yp52qvoDPufUebLksFl7astBNEnjPVUX2e3O9O6VKeUpB0iiHQXfzOOjTEK6Xy6ks4zAG2M6jCL01flIJlxplRXCV7 sadsadsadsadasdasaaaaa"))
      .unwrap();
  assert_eq!(
    [ 217, 255, 84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 115, 116, 114, 32, 56, 32, 115, 116, 114,
      105, 110, 103, 32, 111, 102, 32, 50, 53, 53, 32, 98, 121, 116, 101, 115, 32, 65, 67, 53, 51, 76,
      103, 120, 76, 76, 79, 75, 109, 48, 104, 102, 115, 80, 97, 49, 86, 48, 110, 102, 77, 106, 88, 116,
      110, 109, 107, 69, 116, 116, 114, 117, 67, 80, 106, 99, 53, 49, 100, 116, 69, 77, 76, 82, 74, 73,
      69, 117, 49, 89, 111, 82, 71, 100, 57, 111, 88, 110, 77, 52, 67, 120, 99, 73, 105, 84, 99, 57, 86,
      50, 68, 110, 65, 105, 100, 90, 122, 50, 50, 102, 111, 73, 122, 99, 51, 107, 113, 72, 66, 111, 88,
      103, 89, 115, 107, 101, 118, 102, 111, 74, 53, 82, 75, 89, 112, 53, 50, 113, 118, 111, 68, 80, 117,
      102, 85, 101, 98, 76, 107, 115, 70, 108, 55, 97, 115, 116, 66, 78, 69, 110, 106, 80, 86, 85, 88, 50,
      101, 51, 79, 57, 79, 54, 86, 75, 101, 85, 112, 66, 48, 105, 105, 72, 81, 88, 102, 122, 79, 79, 106,
      84, 69, 75, 54, 88, 121, 54, 107, 115, 52, 122, 65, 71, 50, 77, 54, 106, 67, 76, 48, 49, 102, 108,
      73, 74, 108, 120, 112, 108, 82, 88, 67, 86, 55, 32, 115, 97, 100, 115, 97, 100, 115, 97, 100, 115,
      97, 100, 97, 115, 100, 97, 115, 97, 97, 97, 97, 97 ],
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
    writer.write_i16(&(-3262)).unwrap();
    assert_eq!([209, 243, 66], writer.get_buffer().as_slice());
}

#[test]
fn test_write_i32() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_i32(&(123456)).unwrap();
    assert_eq!([210, 0, 1, 226, 64], writer.get_buffer().as_slice());
}

#[test]
fn write_u64() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    // u64::MAX == 18446744073709551615
    writer.write_u64(&u64::MAX).unwrap();
    assert_eq!(
        [207, 255, 255, 255, 255, 255, 255, 255, 255],
        writer.get_buffer().as_slice()
    );
}

#[test]
fn write_i64() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    // i64::MAX == 9_223_372_036_854_775_807i64
    writer
        .write_i64(&9_223_372_036_854_775_807i64)
        .unwrap();
    assert_eq!(
        [211, 127, 255, 255, 255, 255, 255, 255, 255],
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

#[test]
fn test_write_bytes() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    writer.write_bytes(&[1]).unwrap();
    assert_eq!([196, 1, 1], writer.get_buffer().as_slice());
}

#[test]
fn test_write_fixed_array() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let input_arr: Vec<i32> = vec![1, 2, 545345];
    writer
        .write_array(&input_arr, |writer, item| writer.write_i32(item))
        .unwrap();
    assert_eq!(
        writer.get_buffer().as_slice(),
        [147, 1, 2, 210, 0, 8, 82, 65]
    );
}

#[test]
fn test_write_16_array() {
  let mut writer = WriteEncoder::new(&[], Context::new());
  let input_arr = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
  writer
      .write_array(&input_arr, |writer, item| writer.write_i32(item))
      .unwrap();
  assert_eq!(
      writer.get_buffer().as_slice(),
      [220, 0, 36, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
       22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
  );
}

// TODO: add tests for test_write_16_array test_write_32_array
// https://i5ting.github.io/msgpack-specification/#10309

#[test]
fn test_write_fixed_map() {
    let mut writer = WriteEncoder::new(&[], Context::new());
    let mut map: BTreeMap<String, Vec<i32>> = BTreeMap::new();
    let _ = map.insert("Polywrap".to_string(), vec![3, 5, 9]);
    let _ = map.insert("Rust".to_string(), vec![1, 4, 7]);
    writer
        .write_map(
            &map,
            |writer, key| writer.write_string(key),
            |writer, value| writer.write_array(value, |writer, item| writer.write_i32(item)),
        )
        .unwrap();
    assert_eq!(
        [
            130, 168, 80, 111, 108, 121, 119, 114, 97, 112, 147, 3, 5, 9, 164, 82, 117, 115, 116,
            147, 1, 4, 7
        ],
        writer.get_buffer().as_slice()
    );
}

// TODO: test test_write_16_map test_write_32_map
